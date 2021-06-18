import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Interest } from "src/entities/academy/interest.entity";
import { Client } from "src/entities/client/client.entity";

@Injectable()
export class InterestService {

  constructor(
    @InjectRepository(Interest) private readonly interestRepository: Repository<Interest>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>
  ) {
  }

  async getInterestsClient(clientId: number) {
    const interests = await this.interestRepository.createQueryBuilder('interest')
      .addSelect(['client.id'])
      .andWhere('interest.principal = :principal', { principal: true })
      .innerJoinAndSelect('interest.childs', 'child')
      .leftJoinAndSelect('child.clients', 'client', 'client.id = :clientId', { clientId })
      .getMany()

    return interests
  }

  async changeInterest(clientId: number, interestId: number) {

    let client = await this.clientRepository.findOne(clientId)

    let interest = await this.interestRepository.findOne(interestId, {
      relations: ['clients']
    })

    if (interest.clients.some((client) => client.id == clientId))
      interest.clients.filter((client) => client.id !== clientId)
    else
      interest.clients = [...interest.clients, client]

    await this.interestRepository.save(interest)

    return { success: 'OK' }
  }
}