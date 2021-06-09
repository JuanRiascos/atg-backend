import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/entities/user/role.entity";
import { Repository } from "typeorm";

const ROLES = [
  { key: 'client', name: 'Cliente' },
  { key: 'admin', name: 'Administrador' }
]

export class RoleDefault {

  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>
  ) {
    ROLES.map(role => this.create(role))
  }

  async create(_object) {
    const isExist = await this.repository.findOne({ where: { key: _object.key } })

    if (isExist)
      return

    const _new = this.repository.create(_object)

    return this.repository.save(_new)
  }
}