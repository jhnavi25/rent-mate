import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DisputeStatus, RentalStatus } from '@prisma/client';
import { PaymentsService } from '../payments/payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { RentalStateService } from '../rentals/rental-state.service';
import { FileDisputeDto, ResolveDisputeDto } from './dto/dispute.dto';

@Injectable()
export class DisputesService {
  constructor(
    private prisma: PrismaService,
    private payments: PaymentsService,
    private rentalState: RentalStateService,
  ) {}

  async fileDispute(rentalId: string, ownerId: string, dto: FileDisputeDto) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: { listing: true, dispute: true },
    });
    if (!rental) throw new NotFoundException('Rental not found');
    if (rental.listing.ownerId !== ownerId) {
      throw new ForbiddenException('Only owner can file dispute');
    }
    if (rental.status !== RentalStatus.deposit_hold) {
      throw new BadRequestException('Rental must be in deposit_hold');
    }
    if (rental.depositHoldUntil && rental.depositHoldUntil < new Date()) {
      throw new BadRequestException('Inspection window has ended');
    }
    if (rental.dispute) throw new BadRequestException('Dispute already exists');
    if (dto.claimedAmountPaise > rental.depositPaise) {
      throw new BadRequestException('Claim exceeds deposit');
    }

    const dispute = await this.prisma.dispute.create({
      data: {
        rentalId,
        claimedAmountPaise: dto.claimedAmountPaise,
        status: DisputeStatus.open,
        evidence: {
          create: dto.evidenceUrls.map((url) => ({
            url,
            uploadedBy: ownerId,
          })),
        },
      },
      include: { evidence: true },
    });

    await this.rentalState.transition(rentalId, RentalStatus.dispute_open, ownerId);

    await this.prisma.dispute.update({
      where: { id: dispute.id },
      data: { status: DisputeStatus.under_review },
    });

    return this.prisma.dispute.findUnique({
      where: { id: dispute.id },
      include: { evidence: true, rental: true },
    });
  }

  async getByRental(rentalId: string, userId: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: { listing: true, dispute: { include: { evidence: true } } },
    });
    if (!rental) throw new NotFoundException('Rental not found');
    const isParty = rental.renterId === userId || rental.listing.ownerId === userId;
    if (!isParty) throw new ForbiddenException('Access denied');
    return rental.dispute;
  }

  async listForReview() {
    return this.prisma.dispute.findMany({
      where: { status: DisputeStatus.under_review },
      include: {
        rental: { include: { listing: true, renter: true } },
        evidence: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async resolve(disputeId: string, adminId: string, dto: ResolveDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { rental: true },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (dispute.status === DisputeStatus.resolved) {
      throw new BadRequestException('Already resolved');
    }

    const deductPaise = Math.min(
      dto.resolvedAmountPaise,
      dispute.rental.depositPaise,
    );

    await this.payments.refundDepositPartial(dispute.rentalId, deductPaise);

    await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: DisputeStatus.resolved,
        resolvedAmountPaise: dto.resolvedAmountPaise,
        resolution: dto.resolution,
        resolvedById: adminId,
        resolvedAt: new Date(),
      },
    });

    await this.rentalState.transition(
      dispute.rentalId,
      RentalStatus.completed,
      adminId,
    );

    return this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { evidence: true, rental: true },
    });
  }
}
