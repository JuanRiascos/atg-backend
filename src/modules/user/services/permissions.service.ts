import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { States } from "src/entities/@enums/index.enum";
import { UserPermission } from "src/entities/user/user-permission.entity";
import { UserRole } from "src/entities/user/user-role.entity";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(UserRole) private readonly userRolRepository: Repository<UserRole>,
    @InjectRepository(UserPermission) private readonly userPermissionRepository: Repository<UserPermission>
  ) { }

  async getPermissions(id: number) {

    let roles: any = await this.userRolRepository.createQueryBuilder('roles')
      .innerJoin('roles.user', 'user', 'user.state = :stat AND user.id = :id', { stat: States.Active, id })
      .innerJoinAndSelect('roles.role', 'role')
      .where('roles.state = :state', { state: States.Active })
      .getMany()

    let permissions: any = await this.userPermissionRepository.createQueryBuilder('permissions')
      .innerJoin('permissions.user', 'user', 'user.state = :stat  AND user.id = :id', { stat: States.Active, id })
      .innerJoinAndSelect('permissions.permission', 'permission', 'permission.state = :stat', { stat: States.Active })
      .where('permissions.state = :state', { state: States.Active })
      .getMany()

    roles = roles.map(roles => roles.role.key)
    permissions = permissions.map(permissions => permissions.permission.key)

    return { roles, permissions }

  }

}