import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/entities/academy/plan.entity';
import { User } from 'src/entities/user/user.entity';

import { PaymentController } from './payment.controller';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan,
      User
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    StripeService
  ]
})
export class PaymentModule { }
