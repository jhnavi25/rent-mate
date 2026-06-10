import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RentalStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto, MarkReturnedDto } from './dto/rental.dto';
import { RentalStateService } from './rental-state.service';

@Injectable()
export class RentalsService {
  constructor(
    private prisma: PrismaService,
    private state: RentalStateService,
    private config: ConfigService,
    private notifications: NotificationsService,
  ) {}

  private daysBetween(start: Date, end: Date): number {
    const ms = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }

  async create(renterId: string, dto: CreateRentalDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.ownerId === renterId) {
      throw new BadRequestException('Cannot rent your own listing');
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start) throw new BadRequestException('endDate must be after startDate');

    const days = this.daysBetween(start, end);
    const rentalFeePaise = listing.dailyPricePaise * days;
    const platformFeePercent = Number(this.config.get('PLATFORM_FEE_PERCENT', 10));
    const platformFeePaise = Math.round((rentalFeePaise * platformFeePercent) / 100);

    return this.prisma.rental.create({
      data: {
        listingId: dto.listingId,
        renterId,
        startDate: start,
        endDate: end,
        rentalFeePaise,
        depositPaise: listing.depositPaise,
        platformFeePaise,
        status: RentalStatus.draft,
      },
      include: { listing: true },
    });
  }

  async confirmBooking(rentalId: string, renterId: string) {
    const rental = await this.getRentalForRenter(rentalId, renterId);
    if (rental.status !== RentalStatus.draft) {
      throw new BadRequestException('Rental is not in draft state');
    }
    return this.state.transition(rentalId, RentalStatus.payment_pending, renterId);
  }

  async confirmHandoff(rentalId: string, userId: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: { listing: true },
    });
    if (!rental) throw new NotFoundException('Rental not found');
    const isParty = rental.renterId === userId || rental.listing.ownerId === userId;
    if (!isParty) throw new ForbiddenException('Not a party to this rental');

    if (rental.status !== RentalStatus.active) {
      throw new BadRequestException('Rental must be active for handoff');
    }

    return this.state.transition(rentalId, RentalStatus.in_use, userId, {
      handoffConfirmedAt: new Date(),
    });
  }

  async markReturned(rentalId: string, renterId: string, dto: MarkReturnedDto) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: { listing: true },
    });
    if (!rental) throw new NotFoundException('Rental not found');
    if (rental.renterId !== renterId) throw new ForbiddenException('Not your rental');
    if (rental.status !== RentalStatus.in_use) {
      throw new BadRequestException('Rental must be in use');
    }

    await this.state.transition(rentalId, RentalStatus.return_pending, renterId);

    await this.prisma.rentalReturn.upsert({
      where: { rentalId },
      create: {
        rentalId,
        photos: dto.photos,
        notes: dto.notes,
      },
      update: { photos: dto.photos, notes: dto.notes, returnedAt: new Date() },
    });

    const inspectionHours = Number(this.config.get('INSPECTION_WINDOW_HOURS', 72));
    const depositHoldUntil = new Date(Date.now() + inspectionHours * 60 * 60 * 1000);

    await this.state.transition(rentalId, RentalStatus.deposit_hold, renterId, {
      depositHoldUntil,
    });

    await this.notifications.notifyInspectionWindow(rental.listing.ownerId, rentalId);

    return this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: { rentalReturn: true, listing: true, dispute: true },
    });
  }

  async findById(id: string, userId?: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      include: {
        listing: { include: { owner: { select: { id: true, name: true } } } },
        renter: { select: { id: true, name: true } },
        payments: true,
        dispute: { include: { evidence: true } },
        rentalReturn: true,
      },
    });
    if (!rental) throw new NotFoundException('Rental not found');
    if (userId) {
      const isParty =
        rental.renterId === userId || rental.listing.ownerId === userId;
      if (!isParty) throw new ForbiddenException('Access denied');
    }
    return rental;
  }

  async findMine(userId: string) {
    return this.prisma.rental.findMany({
      where: {
        OR: [{ renterId: userId }, { listing: { ownerId: userId } }],
      },
      include: { listing: true, payments: true, dispute: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRentalsPendingDepositRelease() {
    return this.prisma.rental.findMany({
      where: {
        status: RentalStatus.deposit_hold,
        depositHoldUntil: { lte: new Date() },
        dispute: null,
      },
      include: { payments: true },
    });
  }

  async completeRental(rentalId: string, userId: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: { dispute: true },
    });
    if (!rental) throw new NotFoundException('Rental not found');

    const allowedFrom: RentalStatus[] = [
      RentalStatus.deposit_hold,
      RentalStatus.dispute_open,
    ];
    if (!allowedFrom.includes(rental.status)) {
      throw new BadRequestException('Cannot complete from current status');
    }

    return this.state.transition(rentalId, RentalStatus.completed, userId);
  }

  private async getRentalForRenter(rentalId: string, renterId: string) {
    const rental = await this.prisma.rental.findUnique({ where: { id: rentalId } });
    if (!rental) throw new NotFoundException('Rental not found');
    if (rental.renterId !== renterId) throw new ForbiddenException('Not your rental');
    return rental;
  }
}
