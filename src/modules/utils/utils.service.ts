import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Versions } from 'src/entities/utils/versions.entity';

@Injectable()
export class UtilsService {

  constructor(
    @InjectRepository(Versions) private readonly versionsRepository: Repository<Versions>
  ) { }

  async getVersion() {
    const versions = await this.versionsRepository.findOne({
      select: ["id", "appleVersion", "expoVersion", "expoBuild"]
    })

    return { versions }
  }
}