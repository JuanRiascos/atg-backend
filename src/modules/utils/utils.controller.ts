import { Controller, Get } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Controller('utils')
export class UtilsController {

  constructor(private readonly utilsService: UtilsService) { }

  @Get('version')
  async getTypesPayments() {
    return this.utilsService.getVersion();
  }
}