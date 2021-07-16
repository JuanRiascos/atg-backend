import { Inject, Injectable } from '@nestjs/common';

import { Templates } from 'src/@common/services/sendgrid.service';

@Injectable()
export class EmailService {

  constructor(
    @Inject('SendgridService') private readonly sendgridService,
  ) { }

  async sendEmail(user, body) {
    
    /* await this.sendgridService.sendEmail(user?.email, Templates.FEEDBACK, body) */

    return { success: "ok" }
  }
}