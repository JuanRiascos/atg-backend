import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CheckClient } from "src/entities/academy/check-client.entity";
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
    @InjectRepository(CheckClient) private readonly checkClientRepository: Repository<CheckClient>,
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
      const check = await this.checkRepository.createQueryBuilder('check')
      .select(['check.id'])
      .addSelect(['video.id'])
      .innerJoin('check.video', 'video')
      .where('check.id = :checkId', { checkId })
      .getOne()
      
      if(check.video){
        const findLastAnswer = await this.checkRepository.createQueryBuilder('check')
        .innerJoin('check.video', 'video')
        .where('video.id = :videoId', { videoId: check.video.id })
        .getMany()
  
        if(findLastAnswer?.length > 0){
          for (const lastAnswer of findLastAnswer) {
            await this.checkClientRepository.delete({
              client: { id: clientId },
              check: { id: lastAnswer.id }
            })
          }
        }
      }
      
      await this.checkClientRepository.save({
        client: { id: clientId },
        check: { id: checkId }
      })
      
      return 'OK'
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