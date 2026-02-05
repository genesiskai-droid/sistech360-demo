// TECHNOVA 360 Backend - Payments Service with Stripe (DEMO/SANDBOX)
// ============================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_demo', {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, client: { include: { user: true } } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(booking.finalAmount) * 100),
      currency: 'usd',
      metadata: {
        bookingId,
        userId,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount: booking.finalAmount,
        paymentIntentId: paymentIntent.id,
        stripePaymentId: paymentIntent.latest_charge as string,
        status: 'PENDING',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { paymentIntentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.confirmPayment(paymentIntent.id);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await this.prisma.payment.updateMany({
          where: { paymentIntentId: failedPayment.id },
          data: { status: 'FAILED' },
        });
        break;
    }
  }

  async findAll(filters?: { status?: string; userId?: string }) {
    return this.prisma.payment.findMany({
      where: {
        status: filters?.status ? (filters.status as any) : undefined,
        userId: filters?.userId,
      },
      include: {
        booking: { include: { service: true, client: { include: { user: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPaymentStats() {
    const [total, paid, pending, failed, refunded] = await Promise.all([
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: 'PAID' } }),
      this.prisma.payment.count({ where: { status: 'PENDING' } }),
      this.prisma.payment.count({ where: { status: 'FAILED' } }),
      this.prisma.payment.count({ where: { status: 'REFUNDED' } }),
    ]);

    const totalAmount = await this.prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    });

    return {
      total,
      paid,
      pending,
      failed,
      refunded,
      totalRevenue: totalAmount._sum.amount || 0,
    };
  }
}
