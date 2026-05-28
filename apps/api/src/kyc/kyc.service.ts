import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KycStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitKycDto } from './dto/kyc.dto';
import { KycProvider, StubKycProvider } from './kyc.provider';

@Injectable()
export class KycService {
  private provider: KycProvider;

  constructor(
    private prisma: PrismaService,
    config: ConfigService,
  ) {
    const providerName = config.get('KYC_PROVIDER', 'stub');
    this.provider = providerName === 'stub' ? new StubKycProvider() : new StubKycProvider();
  }

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { kycProfile: true },
    });
    return {
      kycStatus: user?.kycStatus,
      kycLevel: user?.kycLevel,
      verifiedAt: user?.verifiedAt,
      profile: user?.kycProfile,
    };
  }

  async submit(userId: string, dto: SubmitKycDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    if (user.kycStatus === KycStatus.verified) {
      return { message: 'Already verified', kycStatus: user.kycStatus };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { kycStatus: KycStatus.pending },
    });

    const result = await this.provider.verify(dto.panNumber, dto.aadhaarMasked);

    if (!result.success) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { kycStatus: KycStatus.rejected },
      });
      throw new BadRequestException(result.message ?? 'KYC verification failed');
    }

    await this.prisma.kycProfile.upsert({
      where: { userId },
      create: {
        userId,
        panNumber: dto.panNumber,
        aadhaarMasked: dto.aadhaarMasked,
        bankAccountLast4: dto.bankAccountLast4,
        providerRef: result.providerRef,
        submittedAt: new Date(),
      },
      update: {
        panNumber: dto.panNumber,
        aadhaarMasked: dto.aadhaarMasked,
        bankAccountLast4: dto.bankAccountLast4,
        providerRef: result.providerRef,
        submittedAt: new Date(),
      },
    });

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: KycStatus.verified,
        kycLevel: 'standard',
        verifiedAt: new Date(),
      },
    });

    return { kycStatus: updated.kycStatus, verifiedAt: updated.verifiedAt };
  }

  async isVerified(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user?.kycStatus === KycStatus.verified;
  }
}
