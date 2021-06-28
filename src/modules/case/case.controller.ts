import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles as roles } from 'src/@common/constants/role.constant';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import multer from 'src/@common/multer/multer';
import { CaseService } from './case.service';

@Controller('case')
export class CaseController {

  constructor(
    private readonly caseService: CaseService
  ) { }

  @Get('/all/:courseId')
  async getCasesCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.caseService.getCases(courseId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async deleteExtraRep(@Param('caseId', ParseIntPipe) caseId: number) {
    const response: any = await this.caseService.deleteCase(caseId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/update-order')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async updateOrder(@Body() body) {
    const response: any = await this.caseService.updateOrder(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }



}
