import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileDisputeDto } from './dto/dispute.dto';
import { DisputesService } from './disputes.service';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputesController {
  constructor(private disputes: DisputesService) {}

  @Post('rentals/:rentalId')
  file(
    @Param('rentalId') rentalId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: FileDisputeDto,
  ) {
    return this.disputes.fileDispute(rentalId, user.sub, dto);
  }

  @Get('rentals/:rentalId')
  getByRental(@Param('rentalId') rentalId: string, @CurrentUser() user: JwtPayload) {
    return this.disputes.getByRental(rentalId, user.sub);
  }
}
