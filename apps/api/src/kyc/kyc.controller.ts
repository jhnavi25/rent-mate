import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SubmitKycDto } from './dto/kyc.dto';
import { KycService } from './kyc.service';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private kyc: KycService) {}

  @Get('status')
  status(@CurrentUser() user: JwtPayload) {
    return this.kyc.getStatus(user.sub);
  }

  @Post('submit')
  submit(@CurrentUser() user: JwtPayload, @Body() dto: SubmitKycDto) {
    return this.kyc.submit(user.sub, dto);
  }
}
