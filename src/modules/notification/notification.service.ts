import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendgridService } from 'src/@common/services/sendgrid.service';
import { StateNotification, TypesNotifications } from 'src/entities/@enums/index.enum';
import { NotificationUser } from 'src/entities/notification/notification-user.entity';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(NotificationUser) private readonly notUserRepository: Repository<NotificationUser>,
    private readonly sendgirdService: SendgridService
  ) { }

  async sendNotification({ type, data }) {
    if (type === TypesNotifications.Email)
      await this.sendEmailNotification(data)
    if (type === TypesNotifications.Push)
      await this.sendPushNotification(data)
  }

  async sendSMSNotification({ }) {

  }

  async sendPushNotification({ }) {

  }

  async sendEmailNotification({ template, email, payload, userId, notificationId }) {
    const notUser = await this.notUserRepository.save({
      shippingDate: new Date(),
      notification: { id: notificationId },
      user: { id: userId }
    })

    const response: any = await this.sendgirdService.sendEmail(email, template, payload)

    if (response.success === 'OK') {
      await this.notUserRepository.update(notUser.id, {
        receivedDate: new Date(),
        stateNotification: StateNotification.Received,
        payload: response['0']
      })
      return { success: 'OK' }
    } else {
      await this.notUserRepository.update(notUser.id, {
        stateNotification: StateNotification.Failed,
        payload: response['0']
      })
      return { error: 'ERROR_SEND_EMAIL' }
    }
  }
}
