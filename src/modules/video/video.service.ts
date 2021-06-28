import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/entities/academy/video.entity';
import { Repository } from 'typeorm';
import { VideoDto } from './dto/video.dto';

@Injectable()
export class VideoService {

  constructor(
    @InjectRepository(Video) private readonly videoRepository: Repository<Video>
  ) { }

  async getVideosCourse(courseId: number) {
    let videos
    try {
      videos = await this.videoRepository.createQueryBuilder('video')
        .innerJoin('video.course', 'course', 'course.id = :courseId', { courseId })
        .getMany()
    } catch (error) {
      return { error }
    }

    return videos
  }

  async createVideo(data: VideoDto, imageUrl: string) {
    const { title, courseId, duration, url, free } = data

    let count = await this.videoRepository.createQueryBuilder('video')
      .orderBy('video.order', 'ASC')
      .innerJoin('video.course', 'course', 'course.id = :courseId', { courseId })
      .getCount()

    let video
    try {
      video = await this.videoRepository.save({
        title,
        duration,
        image: imageUrl,
        url,
        free,
        order: (count + 1),
        course: { id: courseId }
      })
    } catch (error) {
      return { error }
    }

    return video
  }

  async updateVideo(videoId: number, data: VideoDto, imageUrl: string) {
    let body: any = { ...data }

    if (imageUrl)
      body = { ...body, image: imageUrl }

    let video
    try {
      video = await this.videoRepository.findOne(videoId)

      if (!videoId)
        return { error: 'NOT_FOUND' }

      video = { ...video, ...body }
      await this.videoRepository.save(video)
    } catch (error) {
      return { error }
    }

    return { message: 'updated video' }
  }

  async deleteVideo(videoId: number) {
    try {
      await this.videoRepository.delete(videoId)
    } catch (error) {
      return { error }
    }
    return { message: 'Video deleted succesfully' }
  }

  async updateOrder(body: any) {
    const { videos, courseId } = body

    try {
      await Promise.all(videos.map(async (video, index) => {
        await this.videoRepository.update(video.id, { order: (index + 1) })
      }))
    } catch (error) {
      return { error }
    }

    let response = await this.videoRepository.createQueryBuilder('video')
      .innerJoin('video.course', 'course', 'course.id = :courseId', { courseId })
      .orderBy('video.order', 'ASC')
      .getMany()

    return response
  }


}
