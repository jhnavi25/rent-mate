import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RentalStatus } from '@prisma/client';
import { PaymentsService } from '../payments/payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { RentalStateService } from './rental-state.service';
import { RentalsService } from './rentals.service';

@Injectable()
export class RentalsCronService {
  private readonly logger = new Logger(RentalsCronService.name);

  constructor(
    private rentals: RentalsService,
    private payments: PaymentsService,
    private state: RentalStateService,
    private prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async autoReleaseDeposits() {
    const pending = await this.rentals.getRentalsPendingDepositRelease();
    for (const rental of pending) {
      try {
        await this.payments.refundDeposit(rental.id, rental.depositPaise);
        await this.state.transition(
          rental.id,
          RentalStatus.completed,
          rental.renterId,
        );
        this.logger.log(`Auto-released deposit for rental ${rental.id}`);
      } catch (err) {
        this.logger.error(`Failed auto-release for ${rental.id}`, err);
      }
    }
  }
}
