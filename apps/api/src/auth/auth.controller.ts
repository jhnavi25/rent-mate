import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OtpRateLimitGuard } from '../common/guards/otp-rate-limit.guard';
import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('otp/request')
  @UseGuards(OtpRateLimitGuard)
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.auth.requestOtp(dto.phone);
  }

  @Post('otp/verify')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto);
  }

  @Post('dev/login')
  devLogin(@Body() dto: RequestOtpDto) {
    return this.auth.devLogin(dto.phone);
  }
}
