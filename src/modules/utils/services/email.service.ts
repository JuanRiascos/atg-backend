import { Inject, Injectable } from '@nestjs/common';
const fs = require("fs");
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

    const attachments = [body]

    await this.sendgridService.sendEmail(
      "darian7cc@gmail.com",
      Templates.FEEDBACK,
      { ...body, email: user?.email },
      attachments
    )

    return { success: "ok" }
  }
}