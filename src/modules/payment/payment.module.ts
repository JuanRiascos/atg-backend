import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entities/client/client.entity';

import { Plan } from 'src/entities/payment/plan.entity';
import { Subscription } from 'src/entities/payment/subscription.entity';
import { User } from 'src/entities/user/user.entity';
import { PaymentController } from './payment.controller';
import { StripeService } from './stripe/stripe.service';

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
    StripeService
  ]
})
export class PaymentModule { }
