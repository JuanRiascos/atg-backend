import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "src/entities/user/user.entity";
import { Plan } from "src/entities/payment/plan.entity";
import { Client } from "src/entities/client/client.entity";
import { Subscription } from "src/entities/payment/subscription.entity";
import { StateSubscription } from "src/entities/@enums/index.enum";
const stripe = require('stripe')('sk_test_51Iz5zpF7UQ2vcSsa6tNrNcJ5klDLBcWIv6yCD8YgAm5R9X5YXA3Q1h0ln9Pk8k9YR2UcegkGPKEn9nQ7hTkEGewB00YM0UalJ0');

@Injectable()
export class StripeService {

  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    @InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>
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

    const customerBody = {
      email: user.email,
      name: user.person.name,
      phone: user.person.phone,
      payment_method: body.payment_method,
      invoice_settings: {
        default_payment_method: body.payment_method,
      },
    }

    let customer

    if (user?.client?.idCustomerStripe)
      customer = await stripe.customers.update(
        user?.client?.idCustomerStripe,
        customerBody
      );
    else
      customer = await stripe.customers.create(customerBody);


    if (!customer?.id) {
      const error = { error: 'ERROR_CUSTOMER', detail: 'Ocurrio un problema al crear cliente' }
      throw new BadRequestException(error)
    }

    await this.clientRepository.update(user?.client?.id, { idCustomerStripe: customer?.id })

    const plan = await this.planRepository.findOne({
      where: { typesRecurrence: body.typesRecurrence }
    })

    const subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: [{ price: plan.idStripe }],
    });

    if (subscription?.status === 'active') {
      await this.subscriptionRepository.save({
        client: user?.client,
        idStripe: subscription?.id,
        plan,
        stateSubscription: StateSubscription.Active
      })
      /* Enviar correo de pago exitoso */

      return { subscription, customer }

    } else if (subscription?.status === 'incomplete') {
      const error = { error: 'ERROR_SUBSCRIPTION_INCOMPLETE', detail: 'fondos insuficientes' }
      throw new BadRequestException(error)

    } else {
      const error = { error: 'ERROR_SUBSCRIPTION', detail: 'Ocurrio un problema al suscribirse', subscription }
      throw new BadRequestException(error)

    }
  }

  async cancelSubscription(body) {
    let deletedSubscription
    
    try {
      deletedSubscription = await stripe.subscriptions.del(
        body.subscriptionId
      );
    } catch (error) {
      const code = { error: 'ERROR_CARD', detail: error.code }
      throw new BadRequestException(code)
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { idStripe: body.subscriptionId }
    })

    if (deletedSubscription?.id)
      await this.subscriptionRepository.update(subscription?.id, {
        stateSubscription: StateSubscription.Canceled
      })

    return deletedSubscription
  }

}