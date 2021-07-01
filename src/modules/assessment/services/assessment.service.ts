import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StateTry } from 'src/entities/@enums/index.enum';
import { AssessmentClientTry } from 'src/entities/academy/assessment-client-try.entity';
import { Assessment } from 'src/entities/academy/assessment.entity';
import { Question } from 'src/entities/academy/question.entity';
import { Repository } from 'typeorm';
import { AssessmentDto } from '../dto/assessment.dto';

@Injectable()
export class AssessmentService {

  constructor(
    @InjectRepository(Assessment) private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentClientTry) private readonly tryRepository: Repository<AssessmentClientTry>
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
        .getMany()

      assessments.map(item => {
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
      })

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
        .leftJoinAndSelect('assessment.trys', 'trys')
        .leftJoinAndSelect('trys.responses', 'responses')
        .leftJoin('responses.question', 'question')
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
}
