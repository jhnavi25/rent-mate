import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { KycVerifiedGuard } from '../common/guards/kyc-verified.guard';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('rentals/:id/checkout')
  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  checkout(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.payments.createCheckout(id, user.sub, idempotencyKey);
  }

  @Post('webhooks/razorpay')
  webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
    return this.payments.handleWebhook(rawBody, signature ?? '');
  }
}
