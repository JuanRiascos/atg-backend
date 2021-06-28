import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "src/entities/academy/course.entity";

@Injectable()
export class FindService {

  constructor(
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>
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

  async getCourse(courseId: number) {
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
        .leftJoinAndSelect('course.caseStudies', 'caseStudies')
        .where('course.id = :courseId', { courseId })
        .addOrderBy('caseStudies.order', 'ASC')
        .addOrderBy('extraReps.order', 'ASC')
        .addOrderBy('videos.order', 'ASC')
        .getOne()
    } catch (error) {
      return { error }
    }

    if (!course)
      return { error: 'NOT_FOUND' }

    return course
  }
}