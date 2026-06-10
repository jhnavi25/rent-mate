import {
  BadRequestException,
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, PaymentType, RentalStatus } from '@prisma/client';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RentalStateService } from '../rentals/rental-state.service';
import { RentalsService } from '../rentals/rentals.service';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay | null = null;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private config: ConfigService,
    @Inject(forwardRef(() => RentalsService))
    private rentals: RentalsService,
    private rentalState: RentalStateService,
  ) {
    const keyId = config.get('RAZORPAY_KEY_ID');
    const keySecret = config.get('RAZORPAY_KEY_SECRET');
    if (keyId && keySecret) {
      this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
  }

  private getRazorpay(): Razorpay {
    if (!this.razorpay) {
      throw new BadRequestException('Razorpay not configured');
    }
    return this.razorpay;
  }

  async createCheckout(rentalId: string, renterId: string, idempotencyKey?: string) {
    const lockKey = `checkout:${rentalId}`;
    const acquired = await this.redis.acquireLock(lockKey);
    if (!acquired) throw new BadRequestException('Checkout in progress');

    try {
      const rental = await this.prisma.rental.findUnique({
        where: { id: rentalId },
        include: { payments: true, listing: true },
      });
      if (!rental) throw new NotFoundException('Rental not found');
      if (rental.renterId !== renterId) throw new BadRequestException('Not your rental');
      if (rental.status !== RentalStatus.payment_pending) {
        throw new BadRequestException('Rental not awaiting payment');
      }

      const key = idempotencyKey ?? uuidv4();
      const existing = rental.payments.filter((p) => p.idempotencyKey === key);
      if (existing.length === 2) {
        return this.buildCheckoutResponse(rental, existing);
      }

      const payments = await this.ensurePaymentRecords(rental, key);

      if (!this.razorpay) {
        return this.mockCheckout(rental, payments);
      }

      const orders = await Promise.all(
        payments.map(async (p) => {
          if (p.razorpayOrderId) return p;
          const order = await this.getRazorpay().orders.create({
            amount: p.amountPaise,
            currency: 'INR',
            receipt: `${rentalId}_${p.type}`,
          });
          return this.prisma.payment.update({
            where: { id: p.id },
            data: { razorpayOrderId: order.id },
          });
        }),
      );

      return this.buildCheckoutResponse(rental, orders);
    } finally {
      await this.redis.releaseLock(lockKey);
    }
  }

  private async ensurePaymentRecords(
    rental: { id: string; rentalFeePaise: number; depositPaise: number },
    idempotencyKey: string,
  ) {
    const types: { type: PaymentType; amount: number }[] = [
      { type: PaymentType.rental, amount: rental.rentalFeePaise },
      { type: PaymentType.deposit, amount: rental.depositPaise },
    ];

    const results = [];
    for (const { type, amount } of types) {
      let payment = await this.prisma.payment.findFirst({
        where: { rentalId: rental.id, type },
      });
      if (!payment) {
        payment = await this.prisma.payment.create({
          data: {
            rentalId: rental.id,
            type,
            amountPaise: amount,
            idempotencyKey: `${idempotencyKey}_${type}`,
          },
        });
      }
      results.push(payment);
    }
    return results;
  }

  private async mockCheckout(
    rental: { id: string; renterId: string },
    payments: { id: string; type: PaymentType; amountPaise: number }[],
  ) {
    for (const p of payments) {
      await this.prisma.payment.update({
        where: { id: p.id },
        data: {
          status: PaymentStatus.captured,
          razorpayPaymentId: `mock_pay_${p.id}`,
          razorpayOrderId: `mock_order_${p.id}`,
        },
      });
      await this.prisma.ledgerEntry.create({
        data: {
          rentalId: rental.id,
          paymentId: p.id,
          description: `Mock capture ${p.type}`,
          creditPaise: p.amountPaise,
        },
      });
    }
    await this.rentalState.transition(rental.id, RentalStatus.active, rental.renterId);
    return {
      mock: true,
      message: 'Payments simulated (Razorpay keys not set)',
      rentalId: rental.id,
      status: RentalStatus.active,
    };
  }

  private buildCheckoutResponse(
    rental: { id: string },
    payments: { razorpayOrderId: string | null; type: PaymentType; amountPaise: number }[],
  ) {
    return {
      rentalId: rental.id,
      keyId: this.config.get('RAZORPAY_KEY_ID'),
      orders: payments.map((p) => ({
        type: p.type,
        orderId: p.razorpayOrderId,
        amountPaise: p.amountPaise,
      })),
    };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const secret = this.config.get('RAZORPAY_WEBHOOK_SECRET');
    const isProd = this.config.get('NODE_ENV') === 'production';

    if (!secret && isProd) {
      throw new BadRequestException(
        'RAZORPAY_WEBHOOK_SECRET is not configured. Webhook rejected.',
      );
    }

    if (secret) {
      const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
      if (expected !== signature) {
        throw new BadRequestException('Invalid webhook signature');
      }
    }
  

    const payload = JSON.parse(rawBody.toString());
    const eventId = payload.event ?? payload.id ?? JSON.stringify(payload).slice(0, 64);
    const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');

    const existing = await this.prisma.paymentEvent.findUnique({
      where: { eventId },
    });
    if (existing) return { duplicate: true };

    await this.prisma.paymentEvent.create({
      data: { eventId, payloadHash },
    });

    const event = payload.event;
    if (event === 'payment.captured') {
      await this.onPaymentCaptured(payload.payload.payment.entity);
    } else if (event === 'refund.processed') {
      await this.onRefundProcessed(payload.payload.refund.entity);
    }

    return { processed: true };
  }

  private async onPaymentCaptured(paymentEntity: {
    id: string;
    order_id: string;
    amount: number;
  }) {
    const payment = await this.prisma.payment.findFirst({
      where: { razorpayOrderId: paymentEntity.order_id },
      include: { rental: true },
    });
    if (!payment || payment.status === PaymentStatus.captured) return;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.captured,
        razorpayPaymentId: paymentEntity.id,
      },
    });

    await this.prisma.ledgerEntry.create({
      data: {
        rentalId: payment.rentalId,
        paymentId: payment.id,
        description: `Captured ${payment.type}`,
        creditPaise: payment.amountPaise,
      },
    });

    const allPayments = await this.prisma.payment.findMany({
      where: { rentalId: payment.rentalId },
    });
    const allCaptured = allPayments.every((p) => p.status === PaymentStatus.captured);
    if (allCaptured && payment.rental.status === RentalStatus.payment_pending) {
      await this.rentalState.transition(
        payment.rentalId,
        RentalStatus.active,
        payment.rental.renterId,
      );
    }
  }

  private async onRefundProcessed(refundEntity: {
    payment_id: string;
    amount: number;
  }) {
    const payment = await this.prisma.payment.findFirst({
      where: { razorpayPaymentId: refundEntity.payment_id },
    });
    if (!payment) return;

    const refundedPaise = payment.refundedPaise + refundEntity.amount;
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        refundedPaise,
        status:
          refundedPaise >= payment.amountPaise
            ? PaymentStatus.refunded
            : PaymentStatus.captured,
      },
    });

    await this.prisma.ledgerEntry.create({
      data: {
        rentalId: payment.rentalId,
        paymentId: payment.id,
        description: 'Refund processed',
        debitPaise: refundEntity.amount,
      },
    });
  }

  async refundDeposit(rentalId: string, amountPaise?: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { rentalId, type: PaymentType.deposit, status: PaymentStatus.captured },
    });
    if (!payment) throw new NotFoundException('Deposit payment not found');

    const refundAmount = amountPaise ?? payment.amountPaise - payment.refundedPaise;
    if (refundAmount <= 0) return { message: 'Nothing to refund' };

    if (!this.razorpay || payment.razorpayPaymentId?.startsWith('mock_')) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          refundedPaise: payment.refundedPaise + refundAmount,
          status: PaymentStatus.refunded,
        },
      });
      await this.prisma.ledgerEntry.create({
        data: {
          rentalId,
          paymentId: payment.id,
          description: 'Mock deposit refund',
          debitPaise: refundAmount,
        },
      });
      return { refundedPaise: refundAmount, mock: true };
    }

    await this.getRazorpay().payments.refund(payment.razorpayPaymentId!, {
      amount: refundAmount,
    });

    return { refundedPaise: refundAmount, status: 'pending_webhook' };
  }

  async refundDepositPartial(rentalId: string, deductPaise: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { rentalId, type: PaymentType.deposit },
    });
    if (!payment) throw new NotFoundException('Deposit not found');

    const maxDeduct = payment.amountPaise - payment.refundedPaise;
    const actualDeduct = Math.min(deductPaise, maxDeduct);
    const refundAmount = payment.amountPaise - payment.refundedPaise - actualDeduct;

    if (refundAmount > 0) {
      await this.refundDeposit(rentalId, refundAmount);
    }

    return { deductedPaise: actualDeduct, refundedPaise: refundAmount };
  }
}
