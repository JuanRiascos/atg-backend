import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { States, StateSubscription } from "src/entities/@enums/index.enum";
import { Client } from "src/entities/client/client.entity";
import { Repository } from "typeorm";
import moment = require('moment');

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

  async getClientsByDate(query: any) {
    const { initDate, finishDate } = query

    let result = []
    let aux = true
    let init = initDate

    let quantity = 0
    while (aux) {
      if (moment(init).get('month') == moment(finishDate).get('month')) {
        aux = false
      }

      quantity = await this.clientRepository.createQueryBuilder('client')
        .leftJoin('client.user', 'user')
        .where(`user.created_at BETWEEN 
          '${moment(init).startOf('month').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)}' AND 
          '${moment(init).endOf('month').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)}'`)
        .getCount() + quantity

      result.push({
        date: moment(init).format('MMM/YYYY'),
        quantity
      })

      init = moment(init).add(1, 'month')
    }

    return result
  }
}