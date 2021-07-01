import { BadRequestException, Controller, Get, Param, ParseIntPipe, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { response } from 'express';
import { Roles as roles } from 'src/@common/constants/role.constant';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { RolesGuard } from 'src/@common/guards/roles.guard';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { InterestService } from './services/interest.service';

@Controller('client')
export class ClientController {

  constructor(
    private readonly interestService: InterestService
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

}
