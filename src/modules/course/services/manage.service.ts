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

  async createCourse(data: CourseDto, image: any, iconCases: any, iconReps: any) {
    const { color, title, subtitle } = data

    image = image && image[0]
    iconReps = iconReps && iconReps[0]
    iconCases = iconCases && iconCases[0]

    let course
    try {
      course = await this.courseRepository.save({
        title,
        subtitle,
        color,
        image: image?.path,
        iconReps: iconReps?.path,
        iconCases: iconCases?.path
      })
    } catch (error) {
      return { error }
    }

    return course
  }

  async updateCourse(courseId: number, data: CourseDto, image: any, iconCases: any, iconReps: any) {
    let body: any = { ...data }

    image = image && image[0]
    iconReps = iconReps && iconReps[0]
    iconCases = iconCases && iconCases[0]

    if (image)
      body = { ...body, image: image?.path }
    if (iconReps)
      body = { ...body, iconReps: iconReps?.path }
    if (iconCases)
      body = { ...body, iconCases: iconCases?.path }

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

  async setCoverCourse(courseId: number, value: boolean) {
    try {
      await this.courseRepository.update(courseId, {
        cover: value
      })

      if (value)
        await this.courseRepository.createQueryBuilder('course')
          .update()
          .set({
            cover: false
          })
          .where('course.id != :courseId', { courseId })
          .execute()
    } catch (error) {
      return { error }
    }

    return { message: 'update cover course' }
  }
}