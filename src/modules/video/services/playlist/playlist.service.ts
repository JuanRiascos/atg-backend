import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Video } from 'src/entities/academy/video.entity';
import { Client } from 'src/entities/client/client.entity';

@Injectable()
export class PlaylistService {

  constructor(
    @InjectRepository(Video) private readonly videoRepository: Repository<Video>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>
  ) {
  }

  async changeVideoPlayList(clientId: number, videoId: number) {

    let client = await this.clientRepository.findOne(clientId)

    let video = await this.videoRepository.findOne(videoId, {
      relations: ['clients']
    })

    if (video?.clients?.some((client) => client.id == clientId))
      video.clients = video?.clients?.filter((client) => client.id !== clientId)
    else
      video.clients = [...video?.clients, client]

    await this.videoRepository.save(video)

    return { success: 'OK' }
  }

  async getVideoPlayListByClient(clientId: number, courseId?: number) {
    let query = await this.videoRepository.createQueryBuilder('video')
      .addSelect(['client.id'])
      .innerJoin('video.clients', 'client', 'client.id = :clientId', { clientId })

    if (courseId)
      await query.innerJoinAndSelect('video.course', 'course', 'course.id = :courseId', { courseId })
        .leftJoinAndSelect('course.extraReps', 'extraReps')
        .leftJoinAndSelect('course.caseStudies', 'caseStudies')
    else
      await query.leftJoinAndSelect('video.course', 'course')
        .leftJoinAndSelect('course.extraReps', 'extraReps')
        .leftJoinAndSelect('course.caseStudies', 'caseStudies')

    const videos = await query.orderBy("video.id", "ASC")
      .getMany()

    return videos
  }

}