import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyOtpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async requestOtp(phone: string): Promise<{ message: string; devCode?: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: { phone, code, expiresAt },
    });

    const isDev = process.env.NODE_ENV !== 'production';
    return {
      message: 'OTP sent',
      ...(isDev && { devCode: code }),
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.prisma.otpCode.findFirst({
      where: {
        phone: dto.phone,
        code: dto.code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    let user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) {
      user = await this.prisma.user.create({ data: { phone: dto.phone } });
    }

    const token = this.jwt.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });

    return { accessToken: token, user };
  }

  async devLogin(phone: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException('Not available in production');
    }
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({ data: { phone } });
    }
    const token = this.jwt.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });
    return { accessToken: token, user };
  }
}
