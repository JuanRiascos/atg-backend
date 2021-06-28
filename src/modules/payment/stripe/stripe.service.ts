import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "src/entities/user/user.entity";
import { Plan } from "src/entities/payment/plan.entity";
const stripe = require('stripe')('sk_test_51Iz5zpF7UQ2vcSsa6tNrNcJ5klDLBcWIv6yCD8YgAm5R9X5YXA3Q1h0ln9Pk8k9YR2UcegkGPKEn9nQ7hTkEGewB00YM0UalJ0');

@Injectable()
export class StripeService {

  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async verifyCard(req, body) {

    const user = await this.userRepository.findOne(req.user.id, {
      relations: ['client']
    })

    try {
      const response = await stripe.paymentMethods.create(
        {
          type: 'card',
          card: {
            number: body.number,
            exp_month: body.month,
            exp_year: body.year,
            cvc: body.cvc,
          },
        },
      );

      if (response?.id) {
        console.log("update", user?.client?.id, {
          paymentMethod: response.id,
          countryCard: body.countryCard,
          cityCard: body.cityCard,
          cardholder: body.cardholder,
          address: body.address,
          postal: body.postal,

          customer: null,
          subscription: null,
          typePayment: null,
          currenPeriodEnd: null,
        })

        return { payment_method: response.id }
      } else {
        const error = { error: 'ERROR_CARD', detail: 'Ocurrio un problema al verificar la targeta' }
        throw new BadRequestException(error)
      }
    } catch (error) {
      const code = { error: 'ERROR_CARD', detail: error.code }
      throw new BadRequestException(code)
    }

  }

  async createCustomer(body, req) {

    const user = await this.userRepository.findOne(req.user.id, {
      relations: ['client', 'person']
    })

    const customer = await stripe.customers.create({
      payment_method: body.payment_method,
      email: req.user.email,
      invoice_settings: {
        default_payment_method: body.payment_method,
      },
    });

    if (!customer?.id) {
      const error = { error: 'ERROR_CUSTOMER', detail: 'Ocurrio un problema al crear cliente' }
      throw new BadRequestException(error)
    }

    console.log("Actualizar custome client", user?.client?.id, { customer: customer.id })

    const subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: [{ price: 'price_1J7NBJF7UQ2vcSsaRqEaAfDo' }],
    });

    if (subscription?.status === 'active') {
      console.log("Update client", user?.client?.id, {
        subscription: subscription.id,
        state: 'active',
        typePayment: 'stripe',
        currenPeriodEnd: subscription.current_period_end
      })

      /* Enviar correo de pago exitoso */

      return { subscription }
    } else if (subscription?.status === 'incomplete') {
      const error = { error: 'ERROR_SUBSCRIPTION_INCOMPLETE', detail: 'fondos insuficientes' }
      throw new BadRequestException(error)
    } else {
      const error = { error: 'ERROR_SUBSCRIPTION', detail: 'Ocurrio un problema al suscribirse', subscription }
      throw new BadRequestException(error)
    }
  }

  async cancelSubscription(body) {
    try {
      const deleted = await stripe.subscriptions.del(
        body.subscriptionId
      );

      return deleted
    } catch (error) {
      const code = { error: 'ERROR_CARD', detail: error.code }
      throw new BadRequestException(code)
    }
  }
}