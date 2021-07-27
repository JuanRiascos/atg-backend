import { BadRequestException, Controller, Get, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express'
import * as XLSX from 'xlsx';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './@common/guards/roles.guard';
import { Roles as roles } from './@common/constants/role.constant';
import { Roles } from './@common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from './@common/multer/multer';
import { ResponseError, ResponseSuccess } from './@common/interfaces/response';
import { listFiles } from './@common/multer/google-cloud-storage'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello() {
    return this.appService.getHello()
  }

  @Get('/last-images')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async getLastImages() {
    const response = await listFiles()
    return response
  }

  @Post('/upload-image')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @UseInterceptors(FileInterceptor('image', multer.storageGCS('documents')))
  async addCase(@UploadedFile() file): Promise<ResponseError | ResponseSuccess> {
    if (!file)
      throw new BadRequestException()

    return { success: 'OK', payload: file }
  }
}
