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
        .addOrderBy('questions.order', 'ASC')
        .orderBy('assessment.title', 'ASC')
        .getMany()

      for (const item of assessments) {
        let trys = await this.tryRepository.createQueryBuilder('try')
          .innerJoin('try.assessment', 'assessment', 'assessment.id = :assessmentId', { assessmentId: item.id })
          .innerJoin('try.client', 'client', 'client.id = :clientId', { clientId })
          .leftJoinAndSelect('try.responses', 'responses')
          .leftJoin('responses.question', 'question')
          .addOrderBy('question.order', 'ASC')
          .getMany()

        if (trys?.length === 0) {
          item['status'] = 'none'
          item['progress'] = 0
        }
        else {
          let responses = trys[trys.length - 1].responses.length
          let questions = item.questions.length
          let progress = (responses / questions) * 100
          item['progress'] = progress
          if (progress == 100)
            item['status'] = 'finished'
          else
            item['status'] = 'started'
        }
        delete item.questions
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
        .innerJoin('assessment.course', 'course')
        .leftJoinAndSelect('assessment.questions', 'questions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .where('assessment.id = :assessmentId', { assessmentId })
        .addOrderBy('questions.order', 'ASC')
        .addOrderBy('answers.order', 'ASC')
        .getOne()

      let trys = await this.tryRepository.createQueryBuilder('try')
        .addSelect([
          'question.id', 'question.description', 'question.multiple',
          'answers.id', 'answers.description',
          'answers.correct'
        ])
        .innerJoin('try.assessment', 'assessment', 'assessment.id = :assessmentId', { assessmentId })
        .innerJoin('try.client', 'client', 'client.id = :clientId', { clientId })
        .leftJoinAndSelect('try.responses', 'responses')
        .leftJoin('responses.question', 'question')
        .leftJoin('responses.answers', 'answers')
        .addOrderBy('question.order', 'ASC')
        .getMany()

      assessment['trys'] = trys

      if (trys.length === 0)
        assessment['status'] = 'none'
      else {
        let responses = trys[trys.length - 1].responses.length
        let questions = assessment.questions.length
        let progress = (responses / questions) * 100
        if (progress == 100)
          assessment['status'] = 'finished'
        else
          assessment['status'] = 'started'
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
        client: { id: clientId }
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

      await this.tryRepository.save(tryAssessment)
    } catch (error) {
      return { error }
    }

    return { message: 'save response' }
  }

  async getResult(assessmentId: number, clientId: number) {
    try {
      let assessment = await this.assessmentRepository.createQueryBuilder('assessment')
        .select('assessment.id')
        .leftJoinAndSelect('assessment.questions', 'questions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .where('assessment.id = :assessmentId', { assessmentId })
        .addOrderBy('questions.order', 'ASC')
        .addOrderBy('answers.order', 'ASC')
        .getOne()

      let trys = await this.tryRepository.createQueryBuilder('try')
        .addSelect([
          'question.id', 'question.description', 'question.multiple',
          'answers.id', 'answers.description',
          'answers.correct'
        ])
        .innerJoin('try.assessment', 'assessment', 'assessment.id = :assessmentId', { assessmentId })
        .innerJoin('try.client', 'client', 'client.id = :clientId', { clientId })
        .leftJoinAndSelect('try.responses', 'responses')
        .leftJoin('responses.question', 'question')
        .leftJoin('responses.answers', 'answers')
        .addOrderBy('question.order', 'ASC')
        .addOrderBy('answers.order', 'ASC')
        .getMany()

      let lastTry = trys[trys.length - 1]

      let totalValue = 0
      for (const question of assessment.questions) {
        let corrects = question.answers.filter(item => item.correct)
        let value
        if (!question.multiple)
          value = 100
        else {
          value = (100 / corrects.length)
        }

        for (const response of corrects) {
          let exist = lastTry.responses.find(item => item.question.id === question.id)
            .answers.find(item => item.id === response.id)

          if (exist)
            totalValue += value
        }
      }

      let percentageTotal = totalValue / assessment.questions.length
      let status

      if (percentageTotal > 50) {
        status = 'approved'
      } else {
        status = 'reproved'
      }

      return {
        percentageTotal,
        status
      }

    } catch (error) {
      return { error }
    }
  }
}
