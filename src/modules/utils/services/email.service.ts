import { Inject, Injectable } from '@nestjs/common';
import { Templates } from 'src/@common/services/sendgrid.service';
@Injectable()
export class EmailService {

  constructor(
    @Inject('SendgridService') private readonly sendgridService,
  ) { }

  async sendEmailFeedback(user, body) {

    await this.sendgridService.sendEmail(
      "info@athletetechgroup.com",
      Templates.FEEDBACK,
      { ...body, email: user?.email }
    )

    return { success: "ok" }
  }

  async sendEmailAttachments(user, body) {

    const attachments = [body?.file]

    await this.sendgridService.sendEmail(
      user?.email,
      Templates.RESOURCE_SEND,
      {
        title: body?.resource?.title
      },
      attachments
    )

    return { success: "ok" }
  }
}