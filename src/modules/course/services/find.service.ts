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

  async getCourses() {
    let courses
    try {
      courses = await this.courseRepository.createQueryBuilder('course')
        .select(['course.id', 'course.title', 'course.subtitle', 'course.cover',
          'course.color', 'course.image', 'course.iconReps', 'course.iconCases'])
        .addOrderBy('course.title')
        .getMany()
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
          'course.color', 'course.image', 'course.iconReps', 'course.iconCases'])
        .leftJoinAndSelect('course.extraReps', 'extraReps')
        .leftJoinAndSelect('course.videos', 'videos')
        .leftJoinAndSelect('course.caseStudies', 'caseStudies')
        .leftJoinAndSelect('videos.checks', 'checks')
      if (!clientId) {
        query.leftJoinAndSelect('course.assessments', 'assessments')
          .leftJoinAndSelect('assessments.questions', 'questions')
          .leftJoinAndSelect('questions.answers', 'answers')
      }
      if (clientId) {
        query.leftJoinAndSelect('extraReps.clients', 'clientExtraReps', 'clientExtraReps.id = :clientId', { clientId })
          .leftJoinAndSelect('caseStudies.clients', 'clientCaseStudies', 'clientCaseStudies.id = :clientId', { clientId })
          .leftJoinAndSelect('videos.clients', 'client', 'client.id = :clientId', { clientId })
          .leftJoinAndSelect('checks.clients', 'clients', 'client.id = :clientId', { clientId })
      }
      query.where('course.id = :courseId', { courseId })
        .addOrderBy('caseStudies.order', 'ASC')
        .addOrderBy('extraReps.order', 'ASC')
        .addOrderBy('videos.order', 'ASC')
        .addOrderBy('checks.order', 'ASC')
      if (!clientId) {
        query.addOrderBy('questions.order', 'ASC')
          .addOrderBy('answers.order', 'ASC')
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