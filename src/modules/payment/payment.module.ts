import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entities/client/client.entity';

import { Plan } from 'src/entities/payment/plan.entity';
import { Subscription } from 'src/entities/payment/subscription.entity';
import { User } from 'src/entities/user/user.entity';
import { PaymentController } from './payment.controller';
import { PlanService } from './stripe/plan.service';
import { StripeService } from './stripe/stripe.service';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan,
      User,
      Client,
      Subscription
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    StripeService,
    PlanService,
    SubscriptionService
  ]
})
export class PaymentModule { }
