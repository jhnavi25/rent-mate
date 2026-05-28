import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendPush(userId: string, title: string, body: string) {
    this.logger.log(`[FCM stub] user=${userId} title=${title} body=${body}`);
    return { sent: true, stub: true };
  }

  async notifyInspectionWindow(ownerId: string, rentalId: string) {
    return this.sendPush(
      ownerId,
      'Inspection window started',
      `Review rental ${rentalId} for damage claims`,
    );
  }
}
