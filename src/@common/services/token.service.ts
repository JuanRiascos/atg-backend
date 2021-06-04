import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { States } from "../../entities/@enums/index.enum";
import { TokenJwt } from "../strategys/jwt.strategy";
import { PermissionsService } from "../../modules/user/services/permissions.service";
import { User } from "src/entities/user/user.entity";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly permissionsService: PermissionsService
  ) { }

  serializeToken = async (email) => {
    const user = await this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.email'])
      .innerJoinAndSelect('user.person', 'person')
      .leftJoinAndSelect('user.client', 'client')
      .where('user.email = :email AND user.state = :state', { email, state: States.Active })
      .getOne()

    const token: TokenJwt = {
      id: user.id,
      atgAppClientId: user?.client?.id,
      email: user.email,
      person: user.person
    }

    return token
  }

  async validateToken(token: TokenJwt): Promise<any> {
    const { email, id } = token

    const user = await this.userRepository.findOne({ id, email, state: States.Active })
    if (!user) {
      throw new UnauthorizedException('invalid or expire token')
    }

    const { permissions, roles } = await this.permissionsService.getPermissions(user.id)

    return { ...token, permissions, roles }
  }
}