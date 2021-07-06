import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles as roles } from 'src/@common/constants/role.constant';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { RolesGuard } from 'src/@common/guards/roles.guard';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import multer from 'src/@common/multer/multer';
import { PlaylistService } from './services/playlist/playlist.service';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {

  constructor(
    private readonly videoService: VideoService,
    private readonly playlistService: PlaylistService
  ) { }

  @Get('/all/:courseId')
  async getCasesCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.videoService.getVideosCourse(courseId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async deleteExtraRep(@Param('videoId', ParseIntPipe) videoId: number) {
    const response: any = await this.videoService.deleteVideo(videoId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/update-order')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateOrder(@Body() body) {
    const response: any = await this.videoService.updateOrder(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/playlist')
  @UseGuards(AuthGuard('jwt'))
  async getVideoPlayListByClient(
    @Req() req,
    @Query('courseId') courseId: number

  ): Promise<ResponseError | ResponseSuccess> {
    const response = await this.playlistService.getVideoPlayListByClient(req?.user?.atgAppClientId, courseId)

    return { success: 'OK', payload: response }
  }

  @Put('/change-video-playlist/:id')
  @UseGuards(AuthGuard('jwt'))
  async changeVideoPlayList(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
    
  ): Promise<ResponseError | ResponseSuccess> {
    const response = await this.playlistService.changeVideoPlayList(req?.user?.atgAppClientId, id)
    return { success: 'OK', payload: response }
  }

  @Get('/playlist-search')
  @UseGuards(AuthGuard('jwt'))
  async getVideoPlayListByClientSearch(
    @Req() req,
    @Query('searchTerm') searchTerm: string

  ): Promise<ResponseError | ResponseSuccess> {
    const response = await this.playlistService.getVideoPlayListByClientSearch(req?.user?.atgAppClientId, searchTerm)

    return { success: 'OK', payload: response }
  }

}