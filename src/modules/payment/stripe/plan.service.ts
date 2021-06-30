import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Plan } from "src/entities/payment/plan.entity";
import { StateSubscription } from "src/entities/@enums/index.enum";

@Injectable()
export class PlanService {

  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>
  ) { }

  async getPlans(req) {
    return await this.planRepository.createQueryBuilder('plan')
      .addSelect(['client.id'])
      .leftJoinAndSelect(
        'plan.subscriptions',
        'subscription',
        'subscription.stateSubscription IN (:...stateSubscription)',
        {
          stateSubscription: [StateSubscription.Active, StateSubscription.Canceled]
        }
      )
      /* .where("user.id IN (:...ids)", { ids: [1, 2, 3, 4] }) */
      .leftJoin('subscription.client', 'client', 'client.id = :clientId', { clientId: req?.user?.atgAppClientId })
      .orderBy("plan.id", "ASC")
      .getMany()
  }

}