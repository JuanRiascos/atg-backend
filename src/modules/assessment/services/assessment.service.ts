import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assessment } from 'src/entities/academy/assessment.entity';
import { Question } from 'src/entities/academy/question.entity';
import { Repository } from 'typeorm';
import { AssessmentDto } from '../dto/assessment.dto';

@Injectable()
export class AssessmentService {

  constructor(
    @InjectRepository(Assessment) private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Question) private readonly questionRepository: Repository<Question>
  ) { }

  async getAssessments(clientId: number) {
    let assessments
    try {
      assessments = await this.assessmentRepository.createQueryBuilder('assessment')
        .addSelect(['course.title', 'course.color'])
        .innerJoin('assessment.course', 'course')
        .leftJoinAndSelect('assessment.trys', 'trys')
        .leftJoin('trys.client', 'client', 'client.id = :clientId', { clientId })
        .getMany()

      assessments.map(item => {
        if (item.trys.length === 0)
          item['status'] = 'none'
        else {
          item['status'] = item.trys[0].status
        }
      })
    } catch (error) {
      return { error }
    }

    return assessments
  }

  async getAssessment(assessmentId: number) {
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

      /* let cont = 1
      for (const item of questions) {
        await this.questionRepository.save({
          assessment,
          description: item.description,
          order: cont,
        })

        cont++
      } */

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
}
