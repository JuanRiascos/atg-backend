import { BadRequestException, Controller, Get, Param, ParseIntPipe, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, response } from 'express';
import { Roles as roles } from 'src/@common/constants/role.constant';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { RolesGuard } from 'src/@common/guards/roles.guard';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { InterestService } from './services/interest.service';
import { SessionService } from './services/session.service';
import { StatisticService } from './services/statistic.service';

@Controller('client')
export class ClientController {

  constructor(
    private readonly interestService: InterestService,
    private readonly statisticService: StatisticService,
    private readonly sessionService: SessionService
  ) { }

  @Get('/interests')
  @UseGuards(AuthGuard('jwt'))
  async getInterests(@Req() req): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.interestService.getInterestsClient(req?.user?.atgAppClientId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/change-interest/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.CLIENT)
  async changeInterest(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.interestService.changeInterest(req?.user?.atgAppClientId, id)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/registered-clients')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async registeredClients(): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.statisticService.getRegisteredClients()

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/paid-clients')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async paidClients(): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.statisticService.getPaidClients()

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/init-session')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.CLIENT)
  async initSessionClient(@Req() req, @Query() query): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.sessionService.initSession(req?.user?.atgAppClientId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/finish-session')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.CLIENT)
  async finishSessionClient(@Req() req, @Query() query): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.sessionService.finishSession(req?.user?.atgAppClientId, query.sessionId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/average-session-time')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async averageSessionTime(): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.sessionService.averageSessionTime()

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/clients-by-date')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async getclientsByDate(@Query() query): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.statisticService.getClientsByDate(query)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/report-data')
  async getReportData(@Res() res: Response, @Query() query) {
    if (!query.token)
      res.status(401)

    const response: any = await this.statisticService.getReportData()
    res.status(200).download(response.fileName, response.fileName)
  }

  @Get('/content-view')
  async contentView(@Res() res: Response, @Query() query) {
    if (!query.token)
      res.status(401)

    const response: any = await this.statisticService.getContenView()
    res.status(200).download(response.fileName, response.fileName)
  }

}
