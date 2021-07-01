import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { RolesGuard } from 'src/@common/guards/roles.guard';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import multer from 'src/@common/multer/multer';
import { Roles as roles } from '../../@common/constants/role.constant'
import { ExtraService } from './extra.service';

@Controller('extra')
export class ExtraController {

  constructor(
    private readonly extraService: ExtraService
  ) { }

  @Get('/all/:courseId')
  async getExtraRepsCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.extraService.getExtraReps(courseId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @UseInterceptors(FileInterceptor('file', multer.storageGCS('courses/documents/extra-reps')))
  async addExtraRep(@Body() body, @UploadedFile() file): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.extraService.addExtraRep(data, file?.path)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/:extraId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @UseInterceptors(FileInterceptor('file', multer.storageGCS('courses/documents/extra-reps')))
  async updateExtraRep(@Param('extraId', ParseIntPipe) extraId: number, @Body() body, @UploadedFile() file): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.extraService.updateExtraRep(extraId, data, file?.path)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/:extraId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async deleteExtraRep(@Param('extraId', ParseIntPipe) extraId: number) {
    const response: any = await this.extraService.deleteExtraRep(extraId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/update-order')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateOrder(@Body() body) {
    const response: any = await this.extraService.updateOrder(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }


}
