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
      course = await this.courseRepository.createQueryBuilder('course')
        .select(['course.id', 'course.title', 'course.subtitle', 'course.cover',
          'course.color', 'course.image', 'course.iconReps', 'course.iconCases'])
        .leftJoinAndSelect('course.extraReps', 'extraReps')
        .leftJoinAndSelect('course.assessments', 'assessments')
        .leftJoinAndSelect('assessments.questions', 'questions')
        .leftJoinAndSelect('questions.answers', 'answers')
        .leftJoinAndSelect('course.videos', 'videos')
        .leftJoinAndSelect('videos.clients', 'client', 'client.id = :clientId', { clientId })
        .leftJoinAndSelect('course.caseStudies', 'caseStudies')
        .leftJoinAndSelect('caseStudies.clients', 'clientCaseStudies', 'clientCaseStudies.id = :clientId', { clientId })
        .leftJoinAndSelect('extraReps.clients', 'clientExtraReps', 'clientExtraReps.id = :clientId', { clientId })
        .where('course.id = :courseId', { courseId })
        .addOrderBy('caseStudies.order', 'ASC')
        .addOrderBy('extraReps.order', 'ASC')
        .addOrderBy('videos.order', 'ASC')
        .addOrderBy('questions.order', 'ASC')
        .addOrderBy('answers.order', 'ASC')
        .getOne()
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
            `https://player.vimeo.com/video/${video?.url?.replace("https://vimeo.com/", "")}/config`
          ).toPromise()
        } catch (error) {

        }

        const data = await response?.data
        let urlVimeo = data?.request?.files?.hls?.cdns?.akfire_interconnect_quic?.url

        video['urlVimeo'] = urlVimeo || video?.url
      }
    }


    return course
  }
}