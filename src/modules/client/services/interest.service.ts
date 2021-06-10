import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { States } from "src/entities/@enums/index.enum";
import { Interests } from "src/entities/client/interests.entity";
import { Repository } from "typeorm";

@Injectable()
export class InterestService {

  constructor(
    @InjectRepository(Interests) private readonly interestRepository: Repository<Interests>
  ) { }

  async getInterestsClient(clientId: number) {
    const interests = await this.interestRepository.createQueryBuilder('interest')
      .addSelect(['category.id', 'category.title'])
      .innerJoin('interest.category', 'category')
      .innerJoin('interest.client', 'client', 'client.id = :clientId', { clientId })
      .getMany()

    if (!interests)
      return { error: 'NOT_FOUND' }

    return interests
  }

  async changeInterest(clientId: number, categoryId: number) {
    const interest = await this.interestRepository.createQueryBuilder('interest')
      .innerJoin('interest.category', 'category', 'category.id = :categoryId', { categoryId })
      .innerJoin('interest.client', 'client', 'client.id = :clientId', { clientId })
      .getOne()

    if (!interest)
      return { error: 'NOT_FOUND' }

    interest.state = interest.state === States.Active ? States.Inactive : States.Active

    await this.interestRepository.save(interest)

    return { success: 'OK' }
  }
}