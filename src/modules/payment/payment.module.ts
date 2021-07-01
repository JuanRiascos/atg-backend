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
import { ValidateSuscription } from './validateSuscription/validateSuscription.cronjob';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscription,
      Plan,
      User,
      Client
    ]),
    /* TypeOrmModule.forFeature([Subscription], 'payment') */
  ],
  controllers: [PaymentController],
  providers: [
    StripeService,
    PlanService,
    SubscriptionService,
    ValidateSuscription
  ]
})
export class PaymentModule { }
