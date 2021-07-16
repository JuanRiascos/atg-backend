import { Inject, Injectable } from '@nestjs/common';

import { Templates } from 'src/@common/services/sendgrid.service';

@Injectable()
export class EmailService {

  constructor(
    @Inject('SendgridService') private readonly sendgridService,
  ) { }

  async sendEmail(user, body) {

    console.log("body:", body);
    

    await this.sendgridService.sendEmail(
      "darian7cc@gmail.com",
      Templates.FEEDBACK,
      { ...body, email: user?.email }
    )

    return { success: "ok" }
  }
}