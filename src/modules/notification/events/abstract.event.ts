import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationService } from "../notification.service";
import { Event } from "src/entities/notification/event.entity";
import { Notification } from "src/entities/notification/notification.entity";
import { User } from "src/entities/user/user.entity";

@Injectable()
export class AbstractEvent {
  
  @Inject(NotificationService)
  protected notificationService: NotificationService

  @Inject(ConfigService)
  protected configService: ConfigService

  @InjectRepository(Event)
  protected eventRepository: Repository<Event>

  @InjectRepository(Notification)
  protected notificationRepository: Repository<Notification>

  @InjectRepository(User)
  protected userRepository: Repository<User>

}