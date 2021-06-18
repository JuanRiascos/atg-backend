import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles as roles } from 'src/@common/constants/role.constant';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import multer from 'src/@common/multer/multer';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {

  constructor(
    private readonly videoService: VideoService
  ) { }

  @Get('/all/:courseId')
  async getCasesCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.videoService.getVideosCourse(courseId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  @UseInterceptors(FileInterceptor('image', multer.storageGCS('courses/covers')))
  async addVideo(@Body() body, @UploadedFile() file): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.videoService.createVideo(data, file?.path)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/:videoId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  @UseInterceptors(FileInterceptor('image', multer.storageGCS('courses/covers')))
  async updateExtraRep(@Param('videoId', ParseIntPipe) videoId: number, @Body() body, @UploadedFile() file): Promise<ResponseError | ResponseSuccess> {
    const data = JSON.parse(body.data)
    const response: any = await this.videoService.updateVideo(videoId, data, file?.path)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/:videoId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async deleteExtraRep(@Param('videoId', ParseIntPipe) videoId: number) {
    const response: any = await this.videoService.deleteVideo(videoId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }
}
