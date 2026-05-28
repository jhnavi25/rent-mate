import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { KycVerifiedGuard } from '../common/guards/kyc-verified.guard';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private listings: ListingsService) {}

  @Get()
  findAll(@Query('city') city?: string, @Query('category') category?: string) {
    return this.listings.findAll({ city, category });
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  mine(@CurrentUser() user: JwtPayload) {
    return this.listings.findByOwner(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listings.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateListingDto) {
    return this.listings.create(user.sub, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listings.update(id, user.sub, dto);
  }
}
