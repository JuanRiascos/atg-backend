import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assessment } from 'src/entities/academy/assessment.entity';
import { Question } from 'src/entities/academy/question.entity';
import { Repository } from 'typeorm';
import { AssessmentDto } from './dto/assessment.dto';

@Injectable()
export class AssessmentService {

  constructor(
    @InjectRepository(Assessment) private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Question) private readonly questionRepository: Repository<Question>
  ) { }

  async createAssessment(body: AssessmentDto) {
    const { title, description, instructions, duration, questions, courseId } = body
    let assessment

    try {
      assessment = await this.assessmentRepository.save({
        course: { id: courseId },
        title,
        description,
        instructions,
        duration,
      })

      let cont = 1
      for (const item of questions) {
        await this.questionRepository.save({
          assessment,
          description: item.description,
          order: cont,
        })

        cont++
      }

    } catch (error) {
      return { error }
    }

    return assessment
  }
}