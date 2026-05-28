import { BadRequestException, Injectable } from '@nestjs/common';
import { RentalStatus } from '@prisma/client';
import { canTransition, RentalStatus as SharedRentalStatus } from '@rent-mate/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RentalStateService {
  constructor(private prisma: PrismaService) {}

  assertTransition(from: RentalStatus, to: RentalStatus) {
    const fromShared = from as unknown as SharedRentalStatus;
    const toShared = to as unknown as SharedRentalStatus;
    if (!canTransition(fromShared, toShared)) {
      throw new BadRequestException(`Invalid transition: ${from} -> ${to}`);
    }
  }

  async transition(
    rentalId: string,
    to: RentalStatus,
    userId: string,
    extra?: Partial<{ depositHoldUntil: Date; handoffConfirmedAt: Date }>,
  ) {
    const rental = await this.prisma.rental.findUnique({ where: { id: rentalId } });
    if (!rental) throw new BadRequestException('Rental not found');

    this.assertTransition(rental.status, to);

    const updated = await this.prisma.rental.update({
      where: { id: rentalId },
      data: { status: to, ...extra },
      include: { listing: true, payments: true, dispute: true, rentalReturn: true },
    });

    await this.prisma.auditLog.create({
      data: {
        rentalId,
        userId,
        action: 'status_transition',
        fromStatus: rental.status,
        toStatus: to,
      },
    });

    return updated;
  }
}
