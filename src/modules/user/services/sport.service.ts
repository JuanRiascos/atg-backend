import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Sport } from "src/entities/user/sport.entity";

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(Sport) private readonly sportRepository: Repository<Sport>,
  ) { }

  async getSports(q) {
    if (q)
      q = q.toUpperCase()

    const query = await this.sportRepository.createQueryBuilder('sport')

    if (q)
      query.where('UPPER(sport.name) ILIKE :name', { name: '%' + q + '%' })

    const sports = await query.orderBy("sport.id", "ASC")
      .limit(10)
      .getMany()

    return sports
  }

}