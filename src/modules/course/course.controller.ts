import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { FindService } from './services/find.service';
import { ManageService } from './services/manage.service';
import { Roles as roles } from '../../@common/constants/role.constant'
import { Roles } from 'src/@common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'src/@common/multer/multer';

@Controller('course')
export class CourseController {

  constructor(
    private readonly findService: FindService,
    private readonly manageService: ManageService
  ) { }

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  async getCourses(): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.findService.getCourses()

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getCourse(@Query('courseId') courseId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.findService.getCourse(courseId)

    if (response.error)
      throw new NotFoundException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  @UseInterceptors(FileInterceptor('image', multer.storageGCS('course')))
  async createCourse(@UploadedFile() file, @Body() body): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.manageService.createCourse(data, file?.path)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/update/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  @UseInterceptors(FileInterceptor('image', multer.storageGCS('course')))
  async updateCourse(@Param('courseId', ParseIntPipe) courseId: number, @UploadedFile() file, @Body() body): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.manageService.updateCourse(courseId, data, file?.path)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async deleteCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.manageService.deleteCourse(courseId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }
}