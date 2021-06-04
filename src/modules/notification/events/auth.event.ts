import { BadRequestException, Injectable } from "@nestjs/common";
import { OnEvent } from '@nestjs/event-emitter'
import { Templates } from "src/@common/services/sendgrid.service";
import { Events, TypesNotifications } from "src/entities/@enums/index.enum";
import { AbstractEvent } from "./abstract.event";

@Injectable()
export class AuthEvent extends AbstractEvent {

  @OnEvent(Events.SignupAdmin)
  async signupAdmin({ user }) {

    const event = await this.eventRepository.save({
      type: Events.SignupAdmin,
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

    await this.notificationService.sendNotification({
      type: notification.type,
      data: {
        email: user.email,
        template: Templates.SIGNUP_SUCCESS,
        payload: notification.payload,
        userId: user.id,
        notificationId: notification.id
      }
    })

  }

  @OnEvent(Events.Signup)
  async signupComensal({ user }) {

    const event = await this.eventRepository.save({
      type: Events.Signup,
      description: `Se registro un nuevo comensal ${user.email}`
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

    await this.notificationService.sendNotification({
      type: notification.type,
      data: {
        email: user.email,
        template: Templates.SIGNUP_SUCCESS,
        payload: notification.payload,
        userId: user.id,
        notificationId: notification.id
      }
    })
  }

  @OnEvent(Events.ForgotPassword)
  async forgotPassword({ user }) {
    const event = await this.eventRepository.save({
      type: Events.ForgotPassword,
      description: `Se solicitio una recuperación de contraseña ${user.email}`
    })

    const notification = await this.notificationRepository.save({
      event,
      type: TypesNotifications.Email,
      payload: {
        email: user.email,
        name: user.person?.name,
        lastname: user.person?.lastname,
        redirect: `${this.configService.get('app.appHostClient')}/auth/new-password?code=${user.code}`
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