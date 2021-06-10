import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "src/@common/constants/role.constant";
import { States } from "src/entities/@enums/index.enum";
import { User } from "src/entities/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class FindService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  async getListAdmins(id: number) {
    const admins = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.person', 'person')
      .innerJoin('user.roles', 'roles', 'roles.state = :stat', { stat: States.Active })
      .innerJoin('roles.role', 'role', 'role.key = :key', { key: Roles.ADMIN })
      .where('user.state = :active and user.id != :id', { active: States.Active, id })
      .getMany()

    return admins
  }
}