import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { FindService } from './services/find.service';
import { ManageService } from './services/manage.service';
import { Roles as roles } from '../../@common/constants/role.constant'
import { Roles } from 'src/@common/decorators/roles.decorator';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image' },
    { name: 'iconReps' },
    { name: 'iconCases' },
  ], multer.storageGCS('courses/covers')))
  async createCourse(@UploadedFiles() files, @Body() body): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.manageService.createCourse(
      data,
      files?.image,
      files?.iconCases,
      files?.iconReps
    )

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/update/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image' },
    { name: 'iconReps' },
    { name: 'iconCases' },
  ], multer.storageGCS('courses/covers')))
  async updateCourse(@Param('courseId', ParseIntPipe) courseId: number, @UploadedFiles() files, @Body() body): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.manageService.updateCourse(
      courseId,
      data,
      files?.image,
      files?.iconCases,
      files?.iconReps
    )

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

  @Put('/set-cover/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async setCoverCourse(@Param('courseId', ParseIntPipe) courseId: number, @Body() body: any): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.manageService.setCoverCourse(courseId, body?.value)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }
}
