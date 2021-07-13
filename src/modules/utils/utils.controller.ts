import { Controller, Get, Query, Res } from '@nestjs/common';
import { UtilsService } from './utils.service';
@Controller('utils')
export class UtilsController {

  constructor(private readonly utilsService: UtilsService) { }

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
}