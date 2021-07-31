import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CaseStudies } from 'src/entities/academy/case-studies.entity';
import { ViewCaseStudies } from 'src/entities/academy/views-case-studies.entity';
import { Repository } from 'typeorm';
import { CaseDto } from './dto/case.dto';

@Injectable()
export class CaseService {

  constructor(
    @InjectRepository(CaseStudies) private readonly caseRepository: Repository<CaseStudies>,
    @InjectRepository(ViewCaseStudies) private readonly viewRepository: Repository<ViewCaseStudies>
  ) { }

  async getCase(caseId: number, clientId: number) {
    let caseStudy
    try {
      caseStudy = await this.caseRepository.createQueryBuilder('case')
        .leftJoinAndSelect('case.clients', 'client', 'client.id = :clientId', { clientId })
        .where('case.id = :caseId', { caseId })
        .getOne()
    } catch (error) {
      return { error }
    }

    if (!caseStudy)
      return { error: 'NOT_FOUND' }

    return caseStudy
  }

  async getLastCases(clientId: number, params?: any) {
    const { searchTerm } = params
    let cases
    try {
      let query = this.caseRepository.createQueryBuilder('case')
        .select(['case.id', 'case.title', 'case.free'])
        .addSelect(['client.id'])
        .addSelect(['course.id', 'course.color', 'course.iconCases'])
        .leftJoin('case.clients', 'client', 'client.id = :clientId', { clientId })
        .innerJoin('case.course', 'course')

      if (searchTerm)
        query.where('case.title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })

      cases = await query.orderBy('case.id', 'DESC')
        .limit(5)
        .getMany()
    } catch (error) {
      return { error }
    }

    return cases
  }

  async addCase(data: CaseDto, fileUrl: string) {
    const { courseId, title, free, typeDoc, richText, authorizedSendEmail } = data

    let count = await this.caseRepository.createQueryBuilder('case')
      .orderBy('case.order', 'ASC')
      .innerJoin('case.course', 'course', 'course.id = :courseId', { courseId })
      .getCount()

    let caseStudy
    try {
      let data
      if (typeDoc === 'file')
        data = {
          fileUrl
        }
      else if (typeDoc === 'richText')
        data = {
          richText
        }

      caseStudy = await this.caseRepository.save({
        ...data,
        title,
        free,
        typeDoc,
        authorizedSendEmail,
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

  async getTopCases() {
    const cases = await this.caseRepository.createQueryBuilder('case')
      .select(['case.title'])
      .addSelect('count(view.id)', 'quantity')
      .innerJoin('case.views', 'view')
      .orderBy("quantity", "DESC")
      .groupBy('case.id')
      .limit(5)
      .getRawMany()

    return cases
  }

  async addViewCase(clientId: number, body: any) {
    const { caseId } = body

    try {
      let exist = await this.viewRepository.createQueryBuilder('view')
        .innerJoin('view.client', 'client', 'client.id = :clientId', { clientId })
        .innerJoin('view.caseStudy', 'caseStudy', 'caseStudy.id = :caseId', { caseId })
        .getOne()

      await this.viewRepository.save({
        first: exist ? false : true,
        client: { id: clientId },
        caseStudy: { id: caseId }
      })
    } catch (error) {
      return { error }
    }

    return { message: 'view add' }
  }
}
