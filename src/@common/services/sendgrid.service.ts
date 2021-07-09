import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

const sgMail = require('@sendgrid/mail');

export const Templates = {
  VERIFY_FORGOT_PASSWORD: {
    id: 'd-e5d9f40a85f0446ab46b9cf1f03169c2',
    subject: { es: 'Restore Password' }
  }
};

@Injectable()
export class SendgridService {

  private readonly config: any

  constructor(private readonly configService: ConfigService) {
    this.config = configService.get('sendgrid')
    sgMail.setApiKey(this.config.apiKey);
  }

  sendEmail(to: any, template: any, substitutions: any) {
    console.log('Correo enviado a: ', to, substitutions);

    return new Promise((resolve, reject) => {
      const msg = {
        to,
        from: this.config.fromEmail || 'yeisom40@gmail.com',
        templateId: template.id,
        dynamic_template_data: {
          ...substitutions,
          subject: template?.subject['es']
        }
      }

      sgMail.send(msg).then(async data => {
        if (data[0] && data[0].statusCode === 202)
          resolve({ success: 'OK', ...data })
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
