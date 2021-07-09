import { Injectable } from "@nestjs/common";
import { OnEvent } from '@nestjs/event-emitter'
import { Templates } from "src/@common/services/sendgrid.service";
import { Events, TypesNotifications } from "src/entities/@enums/index.enum";
import { AbstractEvent } from "./abstract.event";

@Injectable()
export class AuthEvent extends AbstractEvent {

  @OnEvent(Events.SignupAdmin)
  async signupAdmin({ user }) {
    const event = await this.eventRepository.save({
      eventType: Events.SignupAdmin,
      description: `Se registro un nuevo usuario administrador ${user.email}`
    })

    const notification = await this.notificationRepository.save({
      event,
      type: TypesNotifications.Email,
      payload: {
        email: user.email,
        name: user.person?.name,
        lastname: user.person?.lastname
      }
    })

  }

  @OnEvent(Events.Signup)
  async signup({ user }) {

    const event = await this.eventRepository.save({
      eventType: Events.Signup,
      description: `Se registro un nuevo cliente ${user.email}`
    })

    const notification = await this.notificationRepository.save({
      event,
      type: TypesNotifications.Email,
      payload: {
        email: user.email,
        name: user.person?.name,
        lastname: user.person?.lastname
      }
    })
  }

  @OnEvent(Events.ForgotPassword)
  async forgotPassword({ user }) {
    const event = await this.eventRepository.save({
      eventType: Events.ForgotPassword,
      description: `Se solicitio una recuperación de contraseña ${user.email}`,

    })

    const notification = await this.notificationRepository.save({
      event,
      type: TypesNotifications.Email,
      payload: {
        email: user.email,
        name: user.person?.name,
        lastname: user.person?.lastname,
        redirect: user.roles.includes('admin') ?
          `${this.configService.get('app.appHostAdmin')}/new-password?code=${user.code}` :
          `${this.configService.get('app.appHostClient')}/new-password?code=${user.code}`
      }
    })

    await this.notificationService.sendNotification({
      type: notification.type,
      data: {
        email: user.email,
        template: Templates.VERIFY_FORGOT_PASSWORD,
        payload: notification.payload,
        userId: user.id,
        notificationId: notification.id
      }
    })

  }
}