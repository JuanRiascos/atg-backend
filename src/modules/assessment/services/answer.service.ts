import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Answer } from "src/entities/academy/answer.entity";
import { Question } from "src/entities/academy/question.entity";
import { Repository } from "typeorm";
import { AnswerDto } from "../dto/answer.dto";

@Injectable()
export class AnswerService {

  constructor(
    @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Question) private readonly questionRepository: Repository<Question>
  ) { }

  async addAnswerToQuestion(body: AnswerDto) {
    const { questionId, description, correct } = body

    let count = await this.answerRepository.createQueryBuilder('answer')
      .orderBy('answer.order', 'ASC')
      .innerJoin('answer.question', 'question', 'question.id = :questionId', { questionId })
      .getCount()

    let answer
    try {

      let question = await this.questionRepository.findOne(questionId)

      answer = await this.answerRepository.save({
        description,
        correct,
        order: (count + 1),
        question: { id: questionId }
      })

      if (!question.multiple && correct) {
        let answers = await this.answerRepository.createQueryBuilder('answer')
          .innerJoin('answer.question', 'question', 'question.id = :questionId', { questionId })
          .where('answer.id != :id', { id: answer.id })
          .getMany()
        for (const item of answers) {
          this.answerRepository.update(item.id, {
            correct: false
          })
        }
      }
    } catch (error) {
      return { error }
    }

    return answer
  }

  async updateAnswerToQuestion(answerId: number, body: AnswerDto) {
    const { description, questionId, correct } = body

    let answer
    try {
      let question = await this.questionRepository.findOne(questionId)
      if (!questionId)
        return { error: 'NOT_FOUND' }

      answer = await this.answerRepository.findOne(answerId)
      answer = { ...answer, ...body }

      await this.answerRepository.save(answer)

      if (!question.multiple && correct) {
        let answers = await this.answerRepository.createQueryBuilder('answer')
          .innerJoin('answer.question', 'question', 'question.id = :questionId', { questionId })
          .where('answer.id != :id', { id: answer.id })
          .getMany()
        for (const item of answers) {
          this.answerRepository.update(item.id, {
            correct: false
          })
        }
      }
    } catch (error) {
      return { error }
    }

    return { message: 'updated answer' }
  }

  async deleteAnswerToQuestion(answerId: number) {
    try {
      await this.answerRepository.delete(answerId)
    } catch (error) {
      return { error }
    }
    return { message: 'Answer deleted succesfully' }
  }

  async updateOrderAnswers(body: any) {
    const { answers, questionId } = body
    try {
      await Promise.all(answers.map(async (answer, index) => {
        await this.answerRepository.update(answer.id, { order: (index + 1) })
      }))
    } catch (error) {
      return { error }
    }

    let response = await this.answerRepository.createQueryBuilder('answer')
      .innerJoin('answer.question', 'question', 'question.id = :questionId', { questionId })
      .orderBy('answer.order', 'ASC')
      .getMany()

    return response
  }
}