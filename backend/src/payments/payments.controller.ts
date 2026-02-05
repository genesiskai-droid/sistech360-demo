// TECHNOVA 360 Backend - Payments Controller (DEMO/SANDBOX)
// ============================================================

import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, RawBodyRequest, Headers, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import Stripe from 'stripe';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-intent/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe payment intent for booking' })
  createPaymentIntent(@Param('bookingId') bookingId: string, @Request() req) {
    return this.paymentsService.createPaymentIntent(bookingId, req.user.id);
  }

  @Post('confirm/:paymentIntentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment' })
  confirmPayment(@Param('paymentIntentId') paymentIntentId: string) {
    return this.paymentsService.confirmPayment(paymentIntentId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo', {
      apiVersion: '2023-10-16',
    });
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_demo',
    );
    return this.paymentsService.handleWebhook(event);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments (Admin/Manager)' })
  @Roles('ADMIN', 'MANAGER')
  findAll(@Query('status') status?: string) {
    return this.paymentsService.findAll({ status });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment statistics' })
  @Roles('ADMIN', 'MANAGER')
  getStats() {
    return this.paymentsService.getPaymentStats();
  }
}
