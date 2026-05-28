import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { KycStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KycVerifiedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    if (!userId) return false;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.kycStatus !== KycStatus.verified) {
      throw new ForbiddenException('KYC verification required');
    }
    return true;
  }
}
