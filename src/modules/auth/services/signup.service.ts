import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getManager } from "typeorm";

import { TokenService } from "../../../@common/services/token.service";
import { SignupDto } from "../dto/signup.dto";
import { Roles } from "../../../@common/constants/role.constant";
import { Permissions } from "src/@common/constants/permission.constant";
import { User } from "src/entities/user/user.entity";
import { Person } from "src/entities/user/person.entity";
import { Client } from "src/entities/client/client.entity";
import { Role } from "src/entities/user/role.entity";
import { UserRole } from "src/entities/user/user-role.entity";
import { Permission } from "src/entities/user/permission.entity";
import { UserPermission } from "src/entities/user/user-permission.entity";
import { States } from "src/entities/@enums/index.enum";

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(UserPermission) private readonly userPermissionRepository: Repository<UserPermission>,
    private readonly tokenService: TokenService,
  ) { }

  async signup(body: SignupDto) {
    const {
      email,
      lastname,
      name,
      password,
    } = body

    const isUser = await this.userRepository.createQueryBuilder('user')
      .where('user.email = :email AND user.state = :stat', { email, stat: States.Active })
      .getOne()

    if (isUser)
      return { error: 'EMAIL_IN_USE', message: 'This email address is already in use' }

    await getManager().transaction(async entityManager => {

      const user = await entityManager.save(this.userRepository.create({
        email,
        password,
      }))

      await entityManager.save(this.personRepository.create({
        name,
        lastname,
        user
      }));

      const role = await this.roleRepository.findOne({ where: { key: Roles.CLIENT, state: States.Active } })
      await entityManager.save(this.userRoleRepository.create({
        role,
        user
      }))

      await entityManager.save(this.clientRepository.create({
        user,
        state: States.Active
      }))

    });

    return await this.tokenService.serializeToken(body.email);
  }

  async signupAdmin(body: SignupDto) {
    const {
      name,
      lastname,
      email,
      password,
      superAdmin
    } = body

    const isUser = await this.userRepository.createQueryBuilder('user')
      .innerJoin('user.roles', 'roles', 'roles.state = :stat', { stat: States.Active })
      .innerJoin('roles.role', 'role', 'role.key = :key', { key: Roles.ADMIN })
      .where('user.email = :email AND user.state = :stat', { email, stat: States.Active })
      .getOne()

    if (isUser)
      return { error: 'EMAIL_IN_USE', message: 'This email address is already in use' }

    await getManager().transaction(async entityManager => {

      const user = await entityManager.save(this.userRepository.create({
        email,
        password,
      }))

      await entityManager.save(this.personRepository.create({
        name,
        lastname,
        user
      }));

      const role = await this.roleRepository.findOne({ where: { key: Roles.ADMIN, state: States.Active } })
      await entityManager.save(this.userRoleRepository.create({
        role,
        user
      }))

      if (superAdmin) {
        const permission = await this.permissionRepository.findOne({
          where: { key: Permissions.ADMIN_USERS }
        })
        await entityManager.save(this.userPermissionRepository.create({
          permission,
          user
        }))
      }

    });

    return await this.tokenService.serializeToken(body.email);
  }
}