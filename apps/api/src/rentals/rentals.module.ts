import { Module, forwardRef } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';
import { RentalStateService } from './rental-state.service';
import { RentalsCronService } from './rentals-cron.service';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';

@Module({
  imports: [forwardRef(() => PaymentsModule), NotificationsModule],
  controllers: [RentalsController],
  providers: [RentalsService, RentalStateService, RentalsCronService],
  exports: [RentalsService, RentalStateService],
})
export class RentalsModule {}
