import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { CheckDto } from './dto/check.dto';
import { CheckService } from './services/check.service';

@Controller('video/check')
export class VideoCheckController {

  constructor(
    private readonly checkService: CheckService
  ) { }

  @Get('/all/:videoId')
  @UseGuards(AuthGuard('jwt'))
  async getCheckByVideo(@Req() req, @Param('videoId', ParseIntPipe) videoId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.checkService.getCheckByVideo(videoId, req?.user?.atgAppClientId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/answer')
  @UseGuards(AuthGuard('jwt'))
  async answerClient(@Req() req, @Body() body): Promise<ResponseError | ResponseSuccess> {
    const response = await this.checkService.answerClient(req?.user?.atgAppClientId, body.checkId)

    if(response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

}