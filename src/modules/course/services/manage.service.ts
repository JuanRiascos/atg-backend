import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "src/entities/academy/course.entity";
import { Repository } from "typeorm";
import { CourseDto } from "../dto/course.dto";

@Injectable()
export class ManageService {

  constructor(
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>
  ) { }

  async createCourse(data: CourseDto, imageUrl: string) {
    const { color, title, subtitle } = data

    let course
    try {
      course = await this.courseRepository.save({
        title,
        subtitle,
        color,
        image: imageUrl
      })
    } catch (error) {
      return { error }
    }

    return course
  }

  async updateCourse(courseId: number, data: CourseDto, imageUrl: string) {
    let body: any = { ...data }

    if (imageUrl)
      body = { ...body, image: imageUrl }

    let course
    try {
      course = await this.courseRepository.findOne(courseId)

      if (!course)
        return { error: 'NOT_FOUND' }

      course = { ...course, ...body }
      await this.courseRepository.save(course)
    } catch (error) {
      return { error }
    }

    return { message: 'updated course' }
  }

  async deleteCourse(courseId: number) {
    try {
      await this.courseRepository.delete(courseId)
    } catch (error) {
      return { error }
    }
    return { message: 'Course deleted succesfully' }
  }
}