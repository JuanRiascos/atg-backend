import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { States, StateSubscription } from "src/entities/@enums/index.enum";
import { Client } from "src/entities/client/client.entity";
import { Repository } from "typeorm";

@Injectable()
export class StatisticService {

  constructor(
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>
  ) { }

  async getRegisteredClients() {
    let clients
    try {
      clients = await this.clientRepository.createQueryBuilder('client')
        .innerJoin('client.user', 'user', 'user.state = :stat', { stat: States.Active })
        .where('client.state = :state', { state: States.Active })
        .getCount()
    } catch (error) {
      return { error }
    }

    return clients
  }

  async getPaidClients() {
    let clients
    try {
      clients = await this.clientRepository.createQueryBuilder('client')
        .innerJoin('client.user', 'user', 'user.state = :stat', { stat: States.Active })
        .innerJoin(
          'client.subscriptions',
          'subscription',
          'subscription.stateSubscription IN (:...stateSubscription)',
          {
            stateSubscription: [StateSubscription.Active, StateSubscription.Canceled]
          }
        )
        .where('client.state = :state', { state: States.Active })
        .getCount()
    } catch (error) {
      return { error }
    }

    return clients
  }
}