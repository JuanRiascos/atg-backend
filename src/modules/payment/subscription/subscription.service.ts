import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "src/entities/client/client.entity";
import { StateSubscription } from "src/entities/@enums/index.enum";

@Injectable()
export class SubscriptionService {

  constructor(
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
  ) {
  }

  async getSubscriptionByUser(atgAppClientId) {

    const client = await this.clientRepository.createQueryBuilder('client')
      .select(["client.id"])
      .leftJoinAndSelect(
        'client.subscriptions',
        'subscription',
        'subscription.stateSubscription = :stateSubscription',
        {
          stateSubscription: StateSubscription.Active
        }
      )
      .where('client.id = :atgAppClientId', { atgAppClientId })
      .getOne()

    return {
      subscription: client?.subscriptions?.length ? StateSubscription.Active : StateSubscription.Inactive
    };

  }

}