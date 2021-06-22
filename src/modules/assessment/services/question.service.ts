import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assessment } from "src/entities/academy/assessment.entity";
import { Question } from "src/entities/academy/question.entity";
import { Repository } from "typeorm";
import { QuestionDto } from "../dto/question.dto";

@Injectable()
export class QuestionService {

  constructor(
    @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
    @InjectRepository(Assessment) private readonly assessmentRepository: Repository<Assessment>
  ) { }

  async addQuestion(body: QuestionDto) {
    const { assessmentId, description } = body

    let question
    try {
      question = await this.questionRepository.save({
        description,
        assessment: { id: assessmentId }
      })
    } catch (error) {
      return { error }
    }

    return question
  }

  async updateQuestion(questionId: number, body: QuestionDto) {
    const { assessmentId, description } = body

    let question
    try {
      let assessment = await this.assessmentRepository.findOne(assessmentId)
      if (!assessment)
        return { error: 'NOT_FOUND' }

      question = await this.questionRepository.findOne(questionId)
      question = { ...question, ...body }

      await this.questionRepository.save(question)
    } catch (error) {
      return { error }
    }

    return { message: 'updated question' }
  }

  async deleteQuestion(questionId: number) {
    try {
      await this.questionRepository.delete(questionId)
    } catch (error) {
      return { error }
    }
    return { message: 'Question deleted succesfully' }
  }
}