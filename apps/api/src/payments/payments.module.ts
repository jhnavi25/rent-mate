import { Module, forwardRef } from '@nestjs/common';
import { RentalsModule } from '../rentals/rentals.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [forwardRef(() => RentalsModule)],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
