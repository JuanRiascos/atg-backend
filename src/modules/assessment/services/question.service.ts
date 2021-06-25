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
    const { assessmentId, description, multiple } = body

    let count = await this.questionRepository.createQueryBuilder('question')
      .orderBy('question.order', 'ASC')
      .innerJoin('question.assessment', 'assessment', 'assessment.id = :assessmentId', { assessmentId })
      .getCount()

    let question
    try {
      question = await this.questionRepository.save({
        description,
        order: (count + 1),
        multiple,
        assessment: { id: assessmentId }
      })
    } catch (error) {
      return { error }
    }

    return question
  }

  async updateQuestion(questionId: number, body: QuestionDto) {
    const { assessmentId, description, multiple } = body

    let question
    try {
      let assessment = await this.assessmentRepository.findOne(assessmentId)
      if (!assessment)
        return { error: 'NOT_FOUND' }

      question = await this.questionRepository.findOne(questionId)

      let change = false
      if (question.multiple === true && multiple === false)
        change = true

      question = { ...question, ...body }
      await this.questionRepository.save(question)

      if (change) {
        let answers = await this.answerRepository.createQueryBuilder('answer')
          .innerJoin('answer.question', 'question', 'question.id = :questionId', { questionId })
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
}