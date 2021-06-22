import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Answer } from "src/entities/academy/answer.entity";
import { Assessment } from "src/entities/academy/assessment.entity";
import { Question } from "src/entities/academy/question.entity";
import { Repository } from "typeorm";
import { AnswerDto } from "../dto/answer.dto";
import { QuestionDto } from "../dto/question.dto";

@Injectable()
export class QuestionService {

  constructor(
    @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
    @InjectRepository(Assessment) private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>
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

  async addAnswerToQuestion(body: AnswerDto) {
    const { questionId, description, correct } = body

    let answer
    try {
      answer = await this.answerRepository.save({
        description,
        correct,
        question: { id: questionId }
      })

      if (correct)
        await this.answerRepository.createQueryBuilder('answer')
          .update()
          .set({
            correct: false
          })
          .where('answer.id != :id', { id: answer.id })
          .execute()
    } catch (error) {
      return { error }
    }

    return answer
  }
}