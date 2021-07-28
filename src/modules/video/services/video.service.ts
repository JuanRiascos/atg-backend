import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoQualification } from 'src/entities/academy/video-qualification.entity';
import { Video } from 'src/entities/academy/video.entity';
import { ViewVideos } from 'src/entities/academy/views-videos.entity';
import { Repository } from 'typeorm';
import { VideoDto } from '../dto/video.dto';

@Injectable()
export class VideoService {

  constructor(
    @InjectRepository(Video) private readonly videoRepository: Repository<Video>,
    @InjectRepository(ViewVideos) private readonly viewRepository: Repository<ViewVideos>,
    @InjectRepository(VideoQualification) private readonly videoQualificationRepository: Repository<VideoQualification>,
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
    const { title, courseId, duration, url, free, subtitle, description } = data

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
        subtitle,
        description,
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

  async qualification(clientId, videoId, value) {
    try {
      const qualify = await this.videoQualificationRepository.findOne({
        client: { id: clientId },
        video: { id: videoId },
      })
      if (qualify)
        await this.videoQualificationRepository.update(qualify, { value })
      else
        await this.videoQualificationRepository.save({
          client: { id: clientId },
          video: { id: videoId },
          value
        })
    } catch (error) {
      return { error }
    }
    return { message: 'Video qualification succesfully' }
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

  async getTopVideos() {
    const videos = await this.videoRepository.createQueryBuilder('video')
      .select(['video.title'])
      .addSelect('count(view.id)', 'quantity')
      .innerJoin('video.views', 'view')
      .orderBy("quantity", "DESC")
      .groupBy('video.id')
      .limit(5)
      .getRawMany()

    return videos
  }

  async addViewVideo(clientId: number, body: any) {
    const { videoId } = body

    try {
      let exist = await this.viewRepository.createQueryBuilder('view')
        .innerJoin('view.client', 'client', 'client.id = :clientId', { clientId })
        .innerJoin('view.video', 'video', 'video.id = :videoId', { videoId })
        .getOne()

      await this.viewRepository.save({
        first: exist ? false : true,
        client: { id: clientId },
        video: { id: videoId }
      })
    } catch (error) {
      return { error }
    }

    return { message: 'view add' }
  }

}
