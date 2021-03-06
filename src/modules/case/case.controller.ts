import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles as roles } from 'src/@common/constants/role.constant';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { RolesGuard } from 'src/@common/guards/roles.guard';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import multer from 'src/@common/multer/multer';
import { CaseService } from './case.service';

@Controller('case')
export class CaseController {

  constructor(
    private readonly caseService: CaseService
  ) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.CLIENT)
  async getCase(@Req() req, @Query('caseId') caseId: number,): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.caseService.getCase(caseId, req?.user?.atgAppClientId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/last')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.CLIENT)
  async getLastCases(@Req() req, @Query() params): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.caseService.getLastCases(req?.user?.atgAppClientId, params)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/top')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async getTop(): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.caseService.getTopCases()

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/add-view')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.CLIENT)
  async addView(@Req() req, @Body() body: any): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.caseService.addViewCase(req?.user?.atgAppClientId, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @UseInterceptors(FileInterceptor('file', multer.storageGCS('courses/documents/case-studies')))
  async addCase(@Body() body, @UploadedFile() file): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.caseService.addCase(data, file?.path)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/:caseId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @UseInterceptors(FileInterceptor('file', multer.storageGCS('courses/documents/case-studies')))
  async updateExtraRep(@Param('caseId', ParseIntPipe) caseId: number, @Body() body, @UploadedFile() file): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.caseService.updateCase(caseId, data, file?.path)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/:caseId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async deleteExtraRep(@Param('caseId', ParseIntPipe) caseId: number) {
    const response: any = await this.caseService.deleteCase(caseId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/update-order')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateOrder(@Body() body) {
    const response: any = await this.caseService.updateOrder(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }



}
