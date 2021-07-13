import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TokenService } from "../../../@common/services/token.service";
import { LoginDto } from "../dto/login.dto";
import { Roles } from "src/@common/constants/role.constant";
import { User } from "src/entities/user/user.entity";
import { States } from "src/entities/@enums/index.enum";


@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) { }

  async login(body: LoginDto) {
    const { email, password } = body

    const query = this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.state'])
      .innerJoin('user.roles', 'roles')
      .innerJoin('roles.role', 'role', 'role.key = :role', { role: Roles.CLIENT })
      .where('user.email = :email', { email })
      .andWhere('user.password = :password', { password })

    const user = await query.getOne()
    
    if (!user)
      return { error: "USER_NOT_EXIST", message: "Your email address or password is not valid." }
    else if (user.state === States.Inactive)
      return { error: "USER_INACTIVE", message: "Inactive user" }

    return await this.tokenService.serializeToken(user.email);
  }

  async loginAdmin(body: LoginDto) {
    const { email, password } = body

    const user = await this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.state'])
      .innerJoin('user.roles', 'roles', 'roles.state = :stat', { stat: States.Active })
      .innerJoin('roles.role', 'role', 'role.key = :key', { key: Roles.ADMIN })
      .where('user.email = :email', { email })
      .andWhere('user.password = :password', { password })
      .getOne()

    if (!user)
      return { error: "USER_NOT_EXIST", message: "Your email address or password is not valid." }
    else if (user.state === States.Inactive)
      return { error: "USER_INACTIVE", message: "Inactive user" }

    return await this.tokenService.serializeToken(user.email);
  }
}