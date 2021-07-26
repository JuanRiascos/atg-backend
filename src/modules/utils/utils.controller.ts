import { Body, Controller, Get, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmailService } from './services/email.service';
import { UtilsService } from './utils.service';
@Controller('utils')
export class UtilsController {

  constructor(
    private readonly utilsService: UtilsService,
    private readonly emailService: EmailService
  ) { }

  @Get('version')
  async getTypesPayments() {
    return this.utilsService.getVersion();
  }

  @Get("redirect-app")
  redirect(
    @Res() res,
    @Query('extraQuery') extraQuery: string
  ) {
    return res.redirect(`${extraQuery}`);
  }

  @Post('feedback')
  @UseGuards(AuthGuard('jwt'))
  async feedback(@Request() req, @Body() body) {
    return this.emailService.sendEmailFeedback(req?.user, body)
  }

  @Post('send-email-resource')
  @UseGuards(AuthGuard('jwt'))
  async sendEmailAttachments(@Request() req, @Body() body) {
    return this.emailService.sendEmailAttachments(req?.user, body)
  }
}