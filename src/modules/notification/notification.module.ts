import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/entities/notification/event.entity';
import { NotificationUser } from 'src/entities/notification/notification-user.entity';
import { Notification } from 'src/entities/notification/notification.entity';
import { User } from 'src/entities/user/user.entity';
import { UserModule } from '../user/user.module';
import { AbstractEvent } from './events/abstract.event';
import { AuthEvent } from './events/auth.event';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      Notification,
      User,
      NotificationUser
    ]),
    UserModule
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    AbstractEvent,
    AuthEvent,
  ]
})
export class NotificationModule { }
