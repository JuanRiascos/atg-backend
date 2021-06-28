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

  async updateOrderQuestions(body: any) {
    const { questions, assessmentId } = body

    try {
      await Promise.all(questions.map(async (question, index) => {
        await this.questionRepository.update(question.id, { order: (index + 1) })
      }))
    } catch (error) {
      return { error }
    }

    let response = await this.questionRepository.createQueryBuilder('question')
      .innerJoin('question.assessment', 'assessment', 'assessment.id = :assessmentId', { assessmentId })
      .leftJoinAndSelect('question.answers', 'answers')
      .orderBy('question.order', 'ASC')
      .addOrderBy('answers.order', 'ASC')
      .getMany()

    return response
  }
}