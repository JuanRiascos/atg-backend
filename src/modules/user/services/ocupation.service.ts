import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Ocupation } from "src/entities/user/ocupation.entity";

@Injectable()
export class OcupationService {
  constructor(
    @InjectRepository(Ocupation) private readonly ocupationRepository: Repository<Ocupation>,
  ) { }

  async getOcupations() {
    const ocupations = await this.ocupationRepository.createQueryBuilder('ocupation')
      .orderBy("ocupation.id", "ASC")
      .getMany()

    return ocupations
  }

}