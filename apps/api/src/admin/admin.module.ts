import { Module } from '@nestjs/common';
import { DisputesModule } from '../disputes/disputes.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [DisputesModule],
  controllers: [AdminController],
})
export class AdminModule {}
