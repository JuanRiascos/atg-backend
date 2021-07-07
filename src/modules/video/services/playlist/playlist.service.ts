import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Video } from 'src/entities/academy/video.entity';
import { Client } from 'src/entities/client/client.entity';
import { ExtraReps } from 'src/entities/academy/extra-reps.entity';
import { CaseStudies } from 'src/entities/academy/case-studies.entity';

@Injectable()
export class PlaylistService {

  constructor(
    @InjectRepository(Video) private readonly videoRepository: Repository<Video>,
    @InjectRepository(ExtraReps) private readonly extraRepsRepository: Repository<ExtraReps>,
    @InjectRepository(CaseStudies) private readonly caseStudiesRepository: Repository<CaseStudies>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    private readonly httpService: HttpService
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

  async changeCaseStudiesPlayList(clientId: number, caseStudieId: number) {

    let client = await this.clientRepository.findOne(clientId)

    let caseStudie = await this.caseStudiesRepository.findOne(caseStudieId, {
      relations: ['clients']
    })

    if (caseStudie?.clients?.some((client) => client.id == clientId))
      caseStudie.clients = caseStudie?.clients?.filter((client) => client.id !== clientId)
    else
      caseStudie.clients = [...caseStudie?.clients, client]

    await this.caseStudiesRepository.save(caseStudie)

    return { success: 'OK' }
  }

  async changeExtraRepsPlayList(clientId: number, caseStudieId: number) {

    let client = await this.clientRepository.findOne(clientId)

    let extraRep = await this.extraRepsRepository.findOne(caseStudieId, {
      relations: ['clients']
    })

    if (extraRep?.clients?.some((client) => client.id == clientId))
      extraRep.clients = extraRep?.clients?.filter((client) => client.id !== clientId)
    else
      extraRep.clients = [...extraRep?.clients, client]

    await this.extraRepsRepository.save(extraRep)

    return { success: 'OK' }
  }

  async getVideoPlayListByClient(clientId: number, courseId?: number) {
    const videos = await this.videosPlayList(clientId, courseId)
    const caseStudies = await this.caseStudiesPlayList(clientId, courseId)
    const extraReps = await this.extraRepsPlayList(clientId, courseId)

    return { videos, caseStudies, extraReps }
  }

  async getVideoPlayListByClientSearch(clientId: number, searchTerm: string) {
    const videos = await this.videosPlayList(clientId, undefined, searchTerm)
    const caseStudies = await this.caseStudiesPlayList(clientId, undefined, searchTerm)
    const extraReps = await this.extraRepsPlayList(clientId, undefined, searchTerm)

    return { videos, caseStudies, extraReps }
  }

  async videosPlayList(clientId: number, courseId?: number, searchTerm?: string) {
    let query = await this.videoRepository.createQueryBuilder('video')
      .addSelect(['client.id'])
      .innerJoin('video.clients', 'client', 'client.id = :clientId', { clientId })

    if (courseId)
      await query.innerJoinAndSelect('video.course', 'course', 'course.id = :courseId', { courseId })
    else
      await query.leftJoinAndSelect('video.course', 'course')

    if (searchTerm)
      await query.where('video.title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })

    const videos = await query.orderBy("video.id", "ASC")
      .getMany()

    for (const video of videos) {
      if (video.url) {
        const response = await this.httpService.get(
          `https://player.vimeo.com/video/${video?.url?.replace("https://vimeo.com/", "")}/config`
        ).toPromise()

        const data = await response.data
        let urlVimeo = data?.request?.files?.hls?.cdns?.akfire_interconnect_quic?.url

        video['urlVimeo'] = urlVimeo || video?.url
      }
    }

    return videos
  }

  async caseStudiesPlayList(clientId: number, courseId?: number, searchTerm?: string) {
    let query = await this.caseStudiesRepository.createQueryBuilder('caseStudies')
      .addSelect(['client.id'])
      .innerJoin('caseStudies.clients', 'client', 'client.id = :clientId', { clientId })

    if (courseId)
      await query.innerJoinAndSelect('caseStudies.course', 'course', 'course.id = :courseId', { courseId })
    else
      await query.leftJoinAndSelect('caseStudies.course', 'course')

    if (searchTerm)
      await query.where('caseStudies.title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })

    const caseStudies = await query.orderBy("caseStudies.id", "ASC")
      .getMany()

    return caseStudies
  }

  async extraRepsPlayList(clientId: number, courseId?: number, searchTerm?: string) {
    let query = await this.extraRepsRepository.createQueryBuilder('extraReps')
      .addSelect(['client.id'])
      .innerJoin('extraReps.clients', 'client', 'client.id = :clientId', { clientId })

    if (courseId)
      await query.innerJoinAndSelect('extraReps.course', 'course', 'course.id = :courseId', { courseId })
    else
      await query.leftJoinAndSelect('extraReps.course', 'course')

    if (searchTerm)
      await query.where('extraReps.title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })

    const extraReps = await query.orderBy("extraReps.id", "ASC")
      .getMany()

    return extraReps
  }

}