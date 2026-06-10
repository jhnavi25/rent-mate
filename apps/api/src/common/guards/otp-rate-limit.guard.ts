import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

const MAX_REQUESTS = 5;
const WINDOW_SECONDS = 10 * 60; // 10 minutes

@Injectable()
export class OtpRateLimitGuard implements CanActivate {
  constructor(private redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const phone: string = req.body?.phone;
    const ip: string = req.ip ?? 'unknown';

    await this.check(`otp:phone:${phone}`);
    await this.check(`otp:ip:${ip}`);

    return true;
  }

  private async check(key: string): Promise<void> {
    const client = this.redis.getClient();
    const count = await client.incr(key);
    if (count === 1) await client.expire(key, WINDOW_SECONDS);
    if (count > MAX_REQUESTS) {
      throw new HttpException(
        'Too many OTP requests. Please try again after 10 minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
