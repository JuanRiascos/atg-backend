import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

const sgMail = require('@sendgrid/mail');

export const Templates = {
  VERIFY_FORGOT_PASSWORD: {
    id: 'd-e5d9f40a85f0446ab46b9cf1f03169c2',
    subject: { es: 'Restore Password' }
  },
  FEEDBACK: {
    id: 'd-ec995cd46e5245d9b7c807ff6da15740',
    subject: { es: 'Feedback' }
  }
};

@Injectable()
export class SendgridService {

  private readonly config: any

  constructor(private readonly configService: ConfigService) {
    this.config = configService.get('sendgrid')
    sgMail.setApiKey(this.config.apiKey);
  }

  sendEmail(to: any, template: any, substitutions: any, attachments?) {
    console.log('Correo enviado a: ', to);

    return new Promise((resolve, reject) => {
      const msg = {
        to,
        from: this.config.fromEmail || 'noreply@athletetechgroup.com',
        templateId: template.id,
        dynamic_template_data: {
          ...substitutions,
          subject: template?.subject['es']
        },
        attachments
      }

      sgMail.send(msg).then(async data => {
        if (data[0] && data[0].statusCode === 202)
          resolve({ success: 'OK', email: data?.email })
        else {
          console.log('Sendgrid error', data.response.body);
          resolve({ success: 'ERROR', ...data })
        }
      }).catch(err => {
        console.log('Sendgrid 2 error', err.response.body);

        resolve({ error: 'ERROR', ...err })
      });
    })
  }
}
