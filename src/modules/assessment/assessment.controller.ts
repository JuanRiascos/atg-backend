import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles as roles } from 'src/@common/constants/role.constant';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { AssessmentService } from './assessment.service';
import { AssessmentDto } from './dto/assessment.dto';

@Controller('assessment')
export class AssessmentController {

  constructor(
    private readonly assessmentService: AssessmentService
  ) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async getAssessment(@Query() query): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.assessmentService.getAssessment(query.assessmentId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }


  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async createAssessment(@Body() body: AssessmentDto): Promise<ResponseSuccess | ResponseError> {
    const response: any = await this.assessmentService.createAssessment(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/update/:assessmentId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async updateAssessment(@Param('assessmentId', ParseIntPipe) assessmentId: number, @Body() body: AssessmentDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.assessmentService.updateAssessment(assessmentId, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }


  @Delete('/:assessmentId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async deleteExtraRep(@Param('assessmentId', ParseIntPipe) assessmentId: number) {
    const response: any = await this.assessmentService.deleteAssessment(assessmentId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

}
