import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CaseStudies } from 'src/entities/academy/case-studies.entity';
import { Repository } from 'typeorm';
import { CaseDto } from './dto/case.dto';

@Injectable()
export class CaseService {

  constructor(
    @InjectRepository(CaseStudies) private readonly caseRepository: Repository<CaseStudies>
  ) { }

  async getCases(courseId: number) {
    let cases
    try {
      cases = await this.caseRepository.createQueryBuilder('case')
        .innerJoin('case.course', 'course', 'course.id = :courseId', { courseId })
        .getMany()
    } catch (error) {
      return { error }
    }

    return cases
  }

  async addCase(data: CaseDto, fileUrl: string) {
    const { courseId, title, free } = data

    let count = await this.caseRepository.createQueryBuilder('case')
      .orderBy('case.order', 'ASC')
      .innerJoin('case.course', 'course', 'course.id = :courseId', { courseId })
      .getCount()

    let caseStudy
    try {
      caseStudy = await this.caseRepository.save({
        title,
        fileUrl,
        free,
        order: (count + 1),
        course: { id: courseId }
      })
    } catch (error) {
      return { error }
    }

    return caseStudy
  }

  async updateCase(caseId: number, data: CaseDto, fileUrl: string) {
    let body: any = { ...data }

    if (fileUrl)
      body = { ...body, fileUrl }

    let caseStudy
    try {
      caseStudy = await this.caseRepository.findOne(caseId)

      if (!caseId)
        return { error: 'NOT_FOUND' }

      caseStudy = { ...caseStudy, ...body }
      await this.caseRepository.save(caseStudy)
    } catch (error) {
      return { error }
    }

    return { message: 'updated case' }
  }

  async deleteCase(caseId: number) {
    try {
      await this.caseRepository.delete(caseId)
    } catch (error) {
      return { error }
    }
    return { message: 'Case study deleted succesfully' }
  }

  async updateOrder(body: any) {
    const { cases, courseId } = body

    try {
      await Promise.all(cases.map(async (caseStudy, index) => {
        await this.caseRepository.update(caseStudy.id, { order: (index + 1) })
      }))
    } catch (error) {
      return { error }
    }

    let response = await this.caseRepository.createQueryBuilder('case')
      .innerJoin('case.course', 'course', 'course.id = :courseId', { courseId })
      .orderBy('case.order', 'ASC')
      .getMany()

    return response
  }

}
