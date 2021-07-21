import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles as roles } from 'src/@common/constants/role.constant';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { AssessmentService } from './services/assessment.service';
import { AssessmentDto } from './dto/assessment.dto';
import { QuestionService } from './services/question.service';
import { QuestionDto } from './dto/question.dto';
import { AnswerDto } from './dto/answer.dto';
import { AnswerService } from './services/answer.service';
import { RolesGuard } from 'src/@common/guards/roles.guard';
import { SaveResponseDto } from './dto/save-response.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';

@Controller('assessment')
export class AssessmentController {

  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
    private readonly jwtService: JwtService
  ) { }

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  async getAssessments(@Req() req): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.assessmentService.getAssessments(req.user.atgAppClientId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAssessment(@Query() query, @Req() req): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.assessmentService.getAssessment(query.assessmentId, req.user.atgAppClientId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/start-assessment')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.CLIENT)
  async startAssessment(@Query() query, @Req() req): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.assessmentService.startAssessment(query.assessmentId, req.user.atgAppClientId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async createAssessment(@Body() body: AssessmentDto): Promise<ResponseSuccess | ResponseError> {
    const response: any = await this.assessmentService.createAssessment(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/update/:assessmentId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateAssessment(@Param('assessmentId', ParseIntPipe) assessmentId: number, @Body() body: AssessmentDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.assessmentService.updateAssessment(assessmentId, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/:assessmentId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async deleteAssessment(@Param('assessmentId', ParseIntPipe) assessmentId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.assessmentService.deleteAssessment(assessmentId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/add-question')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async addQuestion(@Body() body: QuestionDto): Promise<ResponseSuccess | ResponseError> {
    const response: any = await this.questionService.addQuestion(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/update-question/:questionId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateQuestion(@Param('questionId', ParseIntPipe) questionId: number, @Body() body: QuestionDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.questionService.updateQuestion(questionId, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/delete-question/:questionId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async deleteQuestion(@Param('questionId', ParseIntPipe) questionId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.questionService.deleteQuestion(questionId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/delete-answer/:answerId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async deleteAnswer(@Param('answerId', ParseIntPipe) answerId: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.answerService.deleteAnswerToQuestion(answerId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/add-answer')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async addAnswerToQuestion(@Body() body: AnswerDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.answerService.addAnswerToQuestion(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/update-answer/:answerId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateAnswerToQuestion(@Param('answerId', ParseIntPipe) answerId: number, @Body() body: AnswerDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.answerService.updateAnswerToQuestion(answerId, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/update-order-answers')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateOrderAnswers(@Body() body): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.answerService.updateOrderAnswers(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/update-order-questions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async updateOrderQuestions(@Body() body): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.questionService.updateOrderQuestions(body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('/save-response')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.CLIENT)
  async saveResponse(@Req() req, @Body() body: SaveResponseDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.assessmentService.saveResponse(req.user.atgAppClientId, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/get-result')
  @UseGuards(AuthGuard('jwt'))
  async getResult(@Req() req, @Query() query): Promise<ResponseError | ResponseSuccess> {
    const response = await this.assessmentService.getResult(query.assessmentId, req.user?.atgAppClientId)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/report-data')
  async getReportData(@Res() res: Response, @Query() query: TokenDto) {
    const verify = this.jwtService.decode(query.token)
    if (!verify)
      return res.sendStatus(401)

    const response: any = await this.assessmentService.getReportData()
    return res.status(200).download(response.fileName, response.fileName)
  }

}
