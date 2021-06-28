import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StripeService } from './stripe/stripe.service';

@Controller('payment')
export class PaymentController {

  constructor(
    private readonly stripeService: StripeService,
  ) { }

  @Post('verify-card')
  @UseGuards(AuthGuard('jwt'))
  async verifyCard(
    @Body() body, @Request() req
  ) {
    return await this.stripeService.verifyCard(req, body)
  }

  @Post('create-customer')
  @UseGuards(AuthGuard('jwt'))
  async createCustomer(
    @Body() body, @Request() req
  ) {
    return await this.stripeService.createCustomer(body, req)
  }

  @Post('cancel-subscription')
  @UseGuards(AuthGuard('jwt'))
  async cancelSubscription(
    @Body() body,
    @Request() req
  ) {
    return await this.stripeService.cancelSubscription(body, req)
  }
}
