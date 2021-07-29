import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "src/entities/academy/course.entity";

@Injectable()
export class FindService {

  constructor(
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>,
    private readonly httpService: HttpService,
  ) { }

  async getCourses(clientId: number) {
    let courses
    try {
      let query = this.courseRepository.createQueryBuilder('course')
        .select(['course.id', 'course.title', 'course.cover',
          'course.color', 'course.image', 'course.icon'])
      if (!clientId)
        query.addSelect(['course.iconReps', 'course.iconCases', 'course.subtitle'])
      query.addOrderBy('course.id', 'DESC')

      courses = await query.getMany()
    } catch (error) {
      return { error }
    }

    return courses
  }

  async getCourse(courseId: number, clientId: number) {
    let course
    try {
      let query = this.courseRepository.createQueryBuilder('course')
        .select(['course.id', 'course.title', 'course.subtitle',
          'course.color', 'course.image', 'course.icon', 'course.iconReps', 'course.iconCases'])
        .addSelect(['extraRep.id', 'extraRep.title', 'extraRep.type', 'extraRep.typeDoc',
          'extraRep.fileUrl', 'extraRep.richText', 'extraRep.free', 'extraRep.order', 'extraRep.authorizedSendEmail'
        ])
        .addSelect(['caseStudie.id', 'caseStudie.title', 'caseStudie.typeDoc', 'caseStudie.fileUrl',
          'caseStudie.richText', 'caseStudie.free', 'caseStudie.order', 'caseStudie.authorizedSendEmail'
        ])
        .addSelect(['video.id', 'video.title', 'video.subtitle', 'video.description', 'video.duration',
          'video.image', 'video.url', 'video.free', 'video.order'
        ])
        .addSelect(['check.id', 'check.description', 'check.order'])
        .leftJoin('course.extraReps', 'extraRep')
        .leftJoin('course.caseStudies', 'caseStudie')
        .leftJoin('course.videos', 'video')
        .leftJoin('video.checks', 'check')
      if (!clientId) {
        query.addSelect(['assessment.id', 'assessment.title', 'assessment.description', 'assessment.duration',
          'assessment.instructions', 'assessment.free'
        ])
          .addSelect(['question.id', 'question.description', 'question.order', 'question.multiple'])
          .addSelect(['answer.id', 'answer.description', 'answer.correct', 'answer.order'])
          .leftJoin('course.assessments', 'assessment')
          .leftJoin('assessment.questions', 'question')
          .leftJoin('question.answers', 'answer')
      }
      if (clientId) {
        query.leftJoinAndSelect('extraRep.clients', 'clientExtraReps', 'clientExtraReps.id = :clientId', { clientId })
          .leftJoinAndSelect('caseStudie.clients', 'clientCaseStudies', 'clientCaseStudies.id = :clientId', { clientId })
          .leftJoinAndSelect('video.clients', 'client', 'client.id = :clientId', { clientId })
      }
      query.where('course.id = :courseId', { courseId })
        .addOrderBy('caseStudie.order', 'ASC')
        .addOrderBy('extraRep.order', 'ASC')
        .addOrderBy('video.order', 'ASC')
        .addOrderBy('check.order', 'ASC')
      if (!clientId) {
        query.addOrderBy('question.order', 'ASC')
          .addOrderBy('answer.order', 'ASC')
      }

      course = await query.getOne()
    } catch (error) {
      return { error }
    }

    if (!course)
      return { error: 'NOT_FOUND' }

    for (const video of course?.videos) {
      if (video.url) {
        let response
        try {
          response = await this.httpService.get(
            `https://api.vimeo.com/videos/${video?.url?.split('/')[3]?.toString()}`,
            {
              headers: {
                'Authorization': `bearer cfa08e688690c7a6d1297b46e953a795`,
                'Content-Type': `application/json`,
                'Accept': `application/vnd.vimeo.*+json;version=3.4`
              }
            }
          ).toPromise()
        } catch (error) {

        }

        const data = await response?.data
        let file = data?.files[0]

        video['file'] = file
      }
    }


    return course
  }
}