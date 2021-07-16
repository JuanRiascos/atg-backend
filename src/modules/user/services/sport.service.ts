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
    console.log('query', q);
    
    q = q.toUpperCase()
    
    const sports = await this.sportRepository.createQueryBuilder('sport')
      .where('UPPER(sport.name) ILIKE :name', { name: '%' + q + '%' })
      .orderBy("sport.id", "ASC")
      .limit(10)
      .getMany()

    return sports
  }

}