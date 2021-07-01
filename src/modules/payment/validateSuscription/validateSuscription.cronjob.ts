import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { Subscription } from 'src/entities/payment/subscription.entity';
import { StateSubscription } from 'src/entities/@enums/index.enum';
@Injectable()
export class ValidateSuscription {
  private readonly logger = new Logger(ValidateSuscription.name);

  constructor(
    @InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>
  ) { }

  //2:30 am Colombia = 30 7 * * *
  @Cron('36 19 * * *')
  async handler() {
    const subscriptions = await this.subscriptionRepository.find({
      where: { stateSubscription: StateSubscription.Canceled }
    })

    await Promise.all(subscriptions.map(async subscription => {
      try {

        const periodEnd: any = moment(subscription.subscriptionEndDate)

        console.log("periodEnd:", periodEnd);
        console.log("isAfter:", moment().isAfter(periodEnd));
        

        if (moment().isAfter(periodEnd))
          await this.subscriptionRepository.update({ id: subscription.id }, {
            stateSubscription: StateSubscription.Inactive
          })

      } catch (e) {
      }
    }))
  }
}