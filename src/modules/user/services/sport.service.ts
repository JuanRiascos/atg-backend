import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Sport } from "src/entities/user/sport.entity";

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(Sport) private readonly sportRepository: Repository<Sport>,
  ) { }

  async getSports() {
    const sports = await this.sportRepository.createQueryBuilder('sport')
      .orderBy("sport.id", "ASC")
      .getMany()

    return sports
  }

}