import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "src/entities/user/user.entity";

@Injectable()
export class ExpoService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async saveTokenExpo(userId, { tokenExpo }) {
    const update = await this.userRepository.update(userId, { tokenExpo });

    if (update?.affected !== 1)
      return { error: 'ERROR_UPDATE', message: 'Ocurrio un problema al actualizar los datos.' }

    return update
  }

}