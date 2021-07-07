import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StateTry } from 'src/entities/@enums/index.enum';
import { Answer } from 'src/entities/academy/answer.entity';
import { AssessmentClientTry } from 'src/entities/academy/assessment-client-try.entity';
import { Assessment } from 'src/entities/academy/assessment.entity';
import { ClientQuestion } from 'src/entities/academy/client-question.entity';
import { Question } from 'src/entities/academy/question.entity';
import { Repository } from 'typeorm';
import { AssessmentDto } from '../dto/assessment.dto';
import { SaveResponseDto } from '../dto/save-response.dto';

@Injectable()
export class AssessmentService {

  constructor(
    @InjectRepository(Assessment) private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentClientTry) private readonly tryRepository: Repository<AssessmentClientTry>,
    @InjectRepository(ClientQuestion) private readonly responseRepository: Repository<ClientQuestion>,
    @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>
  ) { }

  async calulcateStatusAndProgress(assessmentId: number, clientId) {

  }

  async getAssessments(clientId: number) {
    let assessments
    try {
      assessments = await this.assessmentRepository.createQueryBuilder('assessment')
        .select(['assessment.id', 'assessment.title', 'assessment.free'])
        .addSelect(['course.title', 'course.color'])
        .addSelect(['questions.id'])
        .innerJoin('assessment.course', 'course')
        .innerJoin('assessment.questions', 'questions')
        .leftJoinAndSelect('assessment.trys', 'trys')
        .leftJoinAndSelect('trys.responses', 'responses')
        .leftJoin('responses.question', 'question')
        .leftJoin('trys.client', 'client', 'client.id = :clientId', { clientId })
        .addOrderBy('question.order', 'ASC')
        .addOrderBy('questions.order', 'ASC')
        .orderBy('assessment.title', 'ASC')
        .getMany()

      for (const item of assessments) {
        if (item.trys.length === 0) {
          item['status'] = 'none'
          item['progress'] = 0
        }
        else {
          item['status'] = item.trys[0].status
          let responses = item.trys[0].responses.length
          let questions = item.questions.length
          item['progress'] = (responses / questions) * 100
        }
        delete item.questions
        delete item?.trys
      }

    } catch (error) {
      return { error }
    }

    return assessments
  }

  async getAssessment(assessmentId: number, clientId: number) {
    let assessment
    try {
      assessment = await this.assessmentRepository.createQueryBuilder('assessment')
        .addSelect(['course.title', 'course.color'])
        .addSelect([
          'question.id', 'question.description', 'question.multiple',
          'answersR.id', 'answersR.description',
          'answersR.correct'
        ])
        .innerJoin('assessment.course', 'course')
        .leftJoinAndSelect('assessment.questions', 'questions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('assessment.trys', 'trys')
        .leftJoinAndSelect('trys.responses', 'responses')
        .leftJoin('responses.question', 'question')
        .leftJoin('responses.answers', 'answersR')
        .leftJoin('trys.client', 'client', 'client.id = :clientId', { clientId })
        .where('assessment.id = :assessmentId', { assessmentId })
        .addOrderBy('questions.order', 'ASC')
        .addOrderBy('answers.order', 'ASC')
        .addOrderBy('question.order', 'ASC')
        .getOne()

      if (assessment.trys.length === 0)
        assessment['status'] = 'none'
      else {
        assessment['status'] = assessment.trys[0].status
      }
    } catch (error) {
      return { error }
    }
    return assessment
  }

  async updateAssessment(assessmentId: number, data: AssessmentDto) {
    let body: any = { ...data }

    let assessment
    try {
      assessment = await this.assessmentRepository.findOne(assessmentId)

      if (!assessment)
        return { error: 'NOT_FOUND' }

      assessment = { ...assessment, ...body }
      await this.assessmentRepository.save(assessment)
    } catch (error) {
      return { error }
    }

    return { message: 'updated assessment' }
  }

  async createAssessment(body: AssessmentDto) {
    const { title, description, instructions, duration, questions, free, courseId } = body
    let assessment

    try {
      assessment = await this.assessmentRepository.save({
        course: { id: courseId },
        title,
        description,
        instructions,
        duration,
        free,
      })

    } catch (error) {
      return { error }
    }

    return assessment
  }

  async deleteAssessment(assessmentId: number) {
    try {
      await this.assessmentRepository.delete(assessmentId)
    } catch (error) {
      return { error }
    }
    return { message: 'Assessment deleted succesfully' }
  }

  async startAssessment(assessmentId: number, clientId: number) {
    try {
      await this.tryRepository.save({
        assessment: { id: assessmentId },
        client: { id: clientId },
        status: StateTry.Started
      })
    } catch (error) {
      return { error }
    }

    return { message: 'started assessment' }
  }

  async saveResponse(clientId: number, body: SaveResponseDto) {
    const { assessmentId, questionId, tryId, responses, finalQuestion } = body

    try {
      let tryAssessment = await this.tryRepository.createQueryBuilder('try')
        .innerJoin('try.assessment', 'assessment', 'assessment.id = :assessmentId', { assessmentId })
        .where('try.id = :tryId', { tryId })
        .getOne()

      let question = await this.questionRepository.findOne(questionId)

      if (!question.multiple && responses.length > 1)
        return { error: 'NOT_MANY_RESPONSES' }

      let response = await this.responseRepository.createQueryBuilder('response')
        .innerJoin('response.client', 'client', 'client.id = :clientId', { clientId })
        .innerJoin('response.try', 'try', 'try.id = :tryId', { tryId })
        .innerJoin('response.question', 'question', 'question.id = :questionId', { questionId })
        .getOne()

      if (response)
        return { error: 'ALREADY_EXIST_RESPONSE' }

      let answers = await this.answerRepository.findByIds(responses)

      await this.responseRepository.save({
        client: { id: clientId },
        question: { id: questionId },
        try: tryAssessment,
        answers
      })

      if (finalQuestion) {
        tryAssessment.status = StateTry.Finished
        await this.tryRepository.save(tryAssessment)
      }
    } catch (error) {
      return { error }
    }

    return { message: 'save response' }
  }
}
