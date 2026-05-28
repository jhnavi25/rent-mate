import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResolveDisputeDto } from '../disputes/dto/dispute.dto';
import { DisputesService } from '../disputes/disputes.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private disputes: DisputesService,
    private prisma: PrismaService,
  ) {}

  @Get('disputes')
  listDisputes() {
    return this.disputes.listForReview();
  }

  @Post('disputes/:id/resolve')
  resolveDispute(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.disputes.resolve(id, user.sub, dto);
  }

  @Post('users/:id/promote')
  promoteToAdmin(@Param('id') id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role: UserRole.admin },
    });
  }
}
