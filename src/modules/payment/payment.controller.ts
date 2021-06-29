import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlanService } from './stripe/plan.service';

import { StripeService } from './stripe/stripe.service';
@Controller('payment')
export class PaymentController {

  constructor(
    private readonly stripeService: StripeService,
    private readonly planService: PlanService
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


  @Get('get-plans')
  @UseGuards(AuthGuard('jwt'))
  async getPlans(
    @Request() req
  ) {
    return await this.planService.getPlans(req)
  }
}
