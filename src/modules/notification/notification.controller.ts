import { Body, Controller, Post } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

  constructor(
    private readonly notificationService: NotificationService
  ) { }

  @Post('/example')
  async exampleNotification(@Body() body: NotificationDto) {
    /* return this.notificationService.sendNotification(body) */
  }
}
