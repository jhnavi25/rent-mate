import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { KycVerifiedGuard } from '../common/guards/kyc-verified.guard';
import { CreateRentalDto, MarkReturnedDto } from './dto/rental.dto';
import { RentalsService } from './rentals.service';

@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalsController {
  constructor(private rentals: RentalsService) {}

  @Get('mine')
  mine(@CurrentUser() user: JwtPayload) {
    return this.rentals.findMine(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.rentals.findById(id, user.sub);
  }

  @Post()
  @UseGuards(KycVerifiedGuard)
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateRentalDto) {
    return this.rentals.create(user.sub, dto);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.rentals.confirmBooking(id, user.sub);
  }

  @Post(':id/handoff')
  handoff(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.rentals.confirmHandoff(id, user.sub);
  }

  @Post(':id/return')
  markReturned(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: MarkReturnedDto,
  ) {
    return this.rentals.markReturned(id, user.sub, dto);
  }
}
