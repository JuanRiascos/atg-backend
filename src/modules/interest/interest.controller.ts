import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { Roles as roles } from '../../@common/constants/role.constant'
import { InterestService } from './interest.service';
import { InterestDto } from './dto/interest.dto';
import { RolesGuard } from 'src/@common/guards/roles.guard';

@Controller('interest')
export class InterestController {

  constructor(
    private readonly interestService: InterestService
  ) { }

  @Get()
  async getInterest(@Query('id') id: number): Promise<ResponseError | ResponseSuccess> {
    if (!id)
      throw new BadRequestException()

    const response: any = await this.interestService.getInterest(id)

    if (response.error)
      throw new NotFoundException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/principals')
  async getPrincipals(): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.interestService.getCategoriesPrincipals()

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async createInterest(@Body() body: InterestDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.interestService.createInterest(body)

    if (response.error)
      throw new BadRequestException(response.error)

    return { success: 'OK', payload: response }
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateInterest(@Param('id', ParseIntPipe) id: number, @Body() body: InterestDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.interestService.updateInterest(id, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async deleteInterest(@Param('id', ParseIntPipe) id: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.interestService.deleteInterest(id)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

}
