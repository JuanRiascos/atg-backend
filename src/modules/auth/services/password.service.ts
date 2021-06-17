import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { NewPasswordDto } from "../dto/new-password.dto";
import { Roles } from "src/@common/constants/role.constant";
import { User } from "src/entities/user/user.entity";
import { States } from "src/entities/@enums/index.enum";
import { NewPassworAuthenticatedDto } from "../dto/new-password-authenticated.dto";

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('CryptoService') private cryptoService
  ) { }

  async forgotPassword(email: string) {
    let user: any = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.person', 'person')
      .innerJoinAndSelect('user.roles', 'roles')
      .innerJoinAndSelect('roles.role', 'role')
      .where('user.email = :email', { email })
      .getOne()

    user.roles = user.roles.map(item => item.role.key)

    if (!user)
      return { error: 'USER_NOT_EXIST', message: 'El usuario no existe' }

    if (user.state === States.Inactive)
      return { error: 'USER_INACTIVE', message: 'El usuario esta inactivo' }

    const checkCode = randomStringGenerator();
    await this.userRepository.update({ id: user.id }, { code: checkCode })

    return { success: 'OK', payload: { ...user, code: checkCode } }
  }

  async newPassword(body: NewPasswordDto) {
    const user = await this.userRepository.findOne({ where: { code: body.code } });

    if (!user)
      return { error: 'CODE_ERROR', message: 'El código no coincide con ningún usuario.' }

    if (user.state === States.Inactive)
      return { error: 'USER_INACTIVE', message: 'El usuario esta inactivo.' }

    body.password = this.cryptoService.encrypt(body.password);
    await this.userRepository.update({ id: user.id }, { password: body.password, code: null })

    return { success: 'OK' }
  }

  async newPasswordIsAuthenticated(body: NewPassworAuthenticatedDto, userAuthenticated: any) {
    const user = await this.userRepository.findOne({
      where: {
        id: userAuthenticated.id
      }
    });

    if (!user)
      return { error: "USER_NOT_EXIST", message: "El usuario no existe" }

    if (user.state === States.Inactive)
      return { error: 'USER_INACTIVE', message: 'El usuario esta inactivo.' }

    body.password = this.cryptoService.encrypt(body.password);
    await this.userRepository.update({ id: user.id }, { password: body.password, code: null })

    return { success: 'OK' }

  }

  async changePassword(userId: number, body: any) {
    const user = await this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.state'])
      .innerJoin('user.roles', 'roles', 'roles.state = :stat', { stat: States.Active })
      .innerJoin('roles.role', 'role', 'role.key = :key', { key: Roles.ADMIN })
      .where('user.id = :id', { id: userId })
      .getOne()

    if (!user)
      return { error: 'USER_INACTIVE', message: 'El usuario no existe.' }

    if (user.state === States.Inactive)
      return { error: 'USER_INACTIVE', message: 'El usuario esta inactivo.' }

    body.password = this.cryptoService.encrypt(body.password);
    await this.userRepository.update({ id: user.id }, { password: body.password })

    return { success: 'OK' }
  }
  
}