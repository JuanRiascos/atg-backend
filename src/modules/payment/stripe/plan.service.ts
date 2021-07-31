import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Plan } from "src/entities/payment/plan.entity";
import { StateSubscription } from "src/entities/@enums/index.enum";
import { Client } from "src/entities/client/client.entity";

@Injectable()
export class PlanService {

  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>
  ) { }

  async getPlans(req) {

    const client = await this.clientRepository.createQueryBuilder('client')
      .select(["client.id"])
      .leftJoin(
        'client.subscriptions',
        'subscription',
        'subscription.stateSubscription IN (:...stateSubscription)',
        {
          stateSubscription: [StateSubscription.Active, StateSubscription.Canceled]
        }
      )
      .addSelect(["subscription.id", "subscription.stateSubscription"])
      .where('client.id = :clientId', { clientId: req?.user?.atgAppClientId })
      .getOne()

    const arrayIdSubscriptionsActives = client?.subscriptions?.length > 0 ?
      client?.subscriptions?.map((subscription) => subscription?.id)
      :
      [undefined]

    return await this.planRepository.createQueryBuilder('plan')
      .leftJoin(
        'plan.subscriptions',
        'subscription',
        'subscription.id IN (:...arraySubscriptionsActives)',
        {
          arraySubscriptionsActives: arrayIdSubscriptionsActives
        }
      )
      .addSelect(["subscription.id", "subscription.stateSubscription", "subscription.subscriptionEndDate", "subscription.idStripe"])
      .orderBy("plan.id", "ASC")
      .getMany()
  }

}