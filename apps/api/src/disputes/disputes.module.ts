import { Module } from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
import { RentalsModule } from '../rentals/rentals.module';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';

@Module({
  imports: [PaymentsModule, RentalsModule],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
