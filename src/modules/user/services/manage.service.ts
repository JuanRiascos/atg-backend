import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "src/@common/constants/role.constant";
import { States } from "src/entities/@enums/index.enum";
import { User } from "src/entities/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ManageService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  async deleteAdmin(id: number) {
    const admin = await this.userRepository.createQueryBuilder('user')
      .innerJoin('user.roles', 'roles', 'roles.state = :stat', { stat: States.Active })
      .innerJoin('roles.role', 'role', 'role.key = :key', { key: Roles.ADMIN })
      .where('user.state = :active and user.id = :id', { active: States.Active, id })
      .getOne()

    if (!admin)
      return { error: 'NOT_FOUND' }

    admin.state = States.Inactive

    this.userRepository.save(admin)

    return { succes: 'OK' }
  }
}