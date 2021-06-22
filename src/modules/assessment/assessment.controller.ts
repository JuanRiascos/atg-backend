import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles as roles } from 'src/@common/constants/role.constant';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { AssessmentService } from './services/assessment.service';
import { AssessmentDto } from './dto/assessment.dto';
import { QuestionService } from './services/question.service';
import { QuestionDto } from './dto/question.dto';
import { AnswerDto } from './dto/answer.dto';

@Controller('assessment')
export class AssessmentController {

  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly questionService: QuestionService
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
  async deleteAssessment(@Param('assessmentId', ParseIntPipe) assessmentId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.assessmentService.deleteAssessment(assessmentId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/add-question')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async addQuestion(@Body() body: QuestionDto): Promise<ResponseSuccess | ResponseError> {
    const response: any = await this.questionService.addQuestion(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/update-question/:questionId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async updateQuestion(@Param('questionId', ParseIntPipe) questionId: number, @Body() body: QuestionDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.questionService.updateQuestion(questionId, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/delete-question/:questionId')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async deleteQuestion(@Param('questionId', ParseIntPipe) questionId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.questionService.deleteQuestion(questionId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/add-answer')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async addAnswerToQuestion(@Body() body: AnswerDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.questionService.addAnswerToQuestion(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

}
