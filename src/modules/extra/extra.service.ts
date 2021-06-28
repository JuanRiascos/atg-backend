import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraReps } from 'src/entities/academy/extra-reps.entity';
import { Repository } from 'typeorm';
import { ExtraDto } from './dto/extra.dto';

@Injectable()
export class ExtraService {

  constructor(
    @InjectRepository(ExtraReps) private readonly extraRepsRepository: Repository<ExtraReps>
  ) { }

  async getExtraReps(courseId: number) {
    let extraReps
    try {
      extraReps = await this.extraRepsRepository.createQueryBuilder('extra')
        .innerJoin('extra.course', 'course', 'course.id = :courseId', { courseId })
        .getMany()
    } catch (error) {
      return { error }
    }

    return extraReps
  }

  async addExtraRep(data: ExtraDto, fileUrl: string) {
    const { courseId, title, type, free } = data

    let count = await this.extraRepsRepository.createQueryBuilder('extra')
      .orderBy('extra.order', 'ASC')
      .innerJoin('extra.course', 'course', 'course.id = :courseId', { courseId })
      .getCount()

    let extra
    try {
      extra = await this.extraRepsRepository.save({
        title,
        fileUrl,
        type,
        free,
        order: (count + 1),
        course: { id: courseId }
      })
    } catch (error) {
      return { error }
    }

    return extra
  }

  async updateExtraRep(extraId: number, data: ExtraDto, fileUrl: string) {
    let body: any = { ...data }

    if (fileUrl)
      body = { ...body, fileUrl }

    let extraRep
    try {
      extraRep = await this.extraRepsRepository.findOne(extraId)

      if (!extraId)
        return { error: 'NOT_FOUND' }

      extraRep = { ...extraRep, ...body }
      await this.extraRepsRepository.save(extraRep)
    } catch (error) {
      return { error }
    }

    return { message: 'updated extra reps' }
  }

  async deleteExtraRep(extraId: number) {
    try {
      await this.extraRepsRepository.delete(extraId)
    } catch (error) {
      return { error }
    }
    return { message: 'Extra reps deleted succesfully' }
  }

  async updateOrder(body: any) {
    const { extras, courseId } = body

    try {
      await Promise.all(extras.map(async (extra, index) => {
        await this.extraRepsRepository.update(extra.id, { order: (index + 1) })
      }))
    } catch (error) {
      return { error }
    }

    let response = await this.extraRepsRepository.createQueryBuilder('extra')
      .innerJoin('extra.course', 'course', 'course.id = :courseId', { courseId })
      .orderBy('extra.order', 'ASC')
      .getMany()

    return response
  }
}
