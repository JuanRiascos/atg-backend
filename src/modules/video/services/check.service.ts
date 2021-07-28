import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Check } from "src/entities/academy/check.entity";
import { Video } from "src/entities/academy/video.entity";
import { Client } from "src/entities/client/client.entity";
import { Repository } from "typeorm";
import { CheckDto } from "../dto/check.dto";

@Injectable()
export class CheckService {

  constructor(
    @InjectRepository(Check) private readonly checkRepository: Repository<Check>,
    @InjectRepository(Video) private readonly videoRepository: Repository<Video>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
  ) { }

  async addCheck(body: CheckDto) {
    const { description, videoId } = body

    let count = await this.checkRepository.createQueryBuilder('check')
      .orderBy('check.order', 'ASC')
      .innerJoin('check.video', 'video', 'video.id = :videoId', { videoId })
      .getCount()

    let check
    try {
      check = await this.checkRepository.save({
        description,
        order: (count + 1),
        video: { id: videoId }
      })
    } catch (error) {
      return { error }
    }

    return check
  }

  async updateCheck(checkId: number, body: CheckDto) {
    const { videoId, description } = body

    let check
    try {
      let video = await this.videoRepository.findOne(videoId)
      if (!video)
        return { error: 'NOT_FOUND' }

      check = await this.checkRepository.findOne(checkId)

      check = { ...check, ...body }
      check = await this.checkRepository.save(check)

    } catch (error) {
      return { error }
    }

    return check
  }

  async deleteCheck(checkId: number) {
    try {
      await this.checkRepository.delete(checkId)
    } catch (error) {
      return { error }
    }
    return checkId
  }

  async updateOrderCheck(body: any) {
    const { checks, videoId } = body

    try {
      await Promise.all(checks.map(async (check, index) => {
        await this.checkRepository.update(+check.id, { order: (index + 1) })
      }))
    } catch (error) {
      return { error }
    }

    let response = await this.checkRepository.createQueryBuilder('check')
      .innerJoin('check.video', 'video', 'video.id = :videoId', { videoId })
      .orderBy('check.order', 'ASC')
      .getMany()

    return response
  }

  async answerClient(clientId, checkId) {
    try {
      await this.clientRepository.save({
        id: clientId,
        checks: [checkId]
      })
      return { success: 'OK' }
    } catch (error) {
      return { error }
    }
  }

  async getCheckByVideo(videoId, clientId) {
    const videoChecks: any = await this.videoRepository.createQueryBuilder("video")
    .select(['video.id'])
    .addSelect(['client.id'])
    .innerJoinAndSelect('video.checks', 'checks')
    .leftJoin('checks.clients', 'client', 'client.id = :clientId', { clientId })
    .orderBy('checks.order', 'ASC')
    .where("video.id = :videoId", { videoId })
    .getOne()
    
    if(!videoChecks)
      return []

    return videoChecks.checks.map(item => {
      return {
        id: item.id, 
        description: item.description,
        checkClient: item.clients.length > 0
      }
    })
  }
}