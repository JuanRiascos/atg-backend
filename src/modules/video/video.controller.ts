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
import { CheckDto } from './dto/check.dto';
import { CheckService } from './services/check.service';
import { PlaylistService } from './services/playlist.service';
import { VideoService } from './services/video.service';

@Controller('video')
export class VideoController {

  constructor(
    private readonly videoService: VideoService,
    private readonly playlistService: PlaylistService,
    private readonly checkService: CheckService
  ) { }

  @Get('/all/:courseId')
  async getCasesCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.videoService.getVideosCourse(courseId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/top')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async getTop(): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.videoService.getTopVideos()

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/add-view')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.CLIENT)
  async addView(@Req() req, @Body() body: any): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.videoService.addViewVideo(req?.user?.atgAppClientId, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/qualification')
  @UseGuards(AuthGuard('jwt'))
  async getQualification(@Req() req, @Query('videoId') videoId): Promise<ResponseError | ResponseSuccess> {
    const response = await this.videoService.getQualification(req?.user?.atgAppClientId, videoId)
      
    return { success: 'OK', payload: response }
  }

  @Post('/qualification')
  @UseGuards(AuthGuard('jwt'))
  async qualification(@Req() req, @Body() body): Promise<ResponseError | ResponseSuccess> {
    const response = await this.videoService.qualification(req?.user?.atgAppClientId, body.videoId, body.value)

    if(response.error)
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

  @Put('/change-case-studie-playlist/:id')
  @UseGuards(AuthGuard('jwt'))
  async changeCaseStudiesPlayList(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
    
  ): Promise<ResponseError | ResponseSuccess> {
    const response = await this.playlistService.changeCaseStudiesPlayList(req?.user?.atgAppClientId, id)
    return { success: 'OK', payload: response }
  }

  @Put('/change-extra-rep-playlist/:id')
  @UseGuards(AuthGuard('jwt'))
  async changeExtraRepsPlayList(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
    
  ): Promise<ResponseError | ResponseSuccess> {
    const response = await this.playlistService.changeExtraRepsPlayList(req?.user?.atgAppClientId, id)
    return { success: 'OK', payload: response }
  }

  @Post('/add-check')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async addCheck(@Body() body: CheckDto): Promise<ResponseSuccess | ResponseError> {
    const response: any = await this.checkService.addCheck(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/update-check/:checkId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateCheck(@Param('checkId', ParseIntPipe) checkId: number, @Body() body: CheckDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.checkService.updateCheck(checkId, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/delete-check/:checkId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async deleteCheck(@Param('checkId', ParseIntPipe) checkId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.checkService.deleteCheck(checkId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/update-order-checks')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateOrderChecks(@Body() body: any): Promise<ResponseError | ResponseSuccess> {
    console.log(body)
    const response: any = await this.checkService.updateOrderCheck(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

}