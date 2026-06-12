import { Injectable, Logger } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  async sendPush(userId: string, title: string, body: string) {
    this.logger.log(`[FCM stub] user=${userId} title=${title} body=${body}`);
    return { sent: true, stub: true };
  }

  async notifyInspectionWindow(ownerId: string, rentalId: string) {
    await this.createNotification(
      ownerId,
      'Inspection window started',
      `Review rental ${rentalId} for damage claims`,
      NotificationType.rent_reminder,
    );

    return this.sendPush(
      ownerId,
      'Inspection window started',
      `Review rental ${rentalId} for damage claims`,
    );
  }
}
