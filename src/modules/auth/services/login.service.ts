import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getManager, Repository } from "typeorm";

import { TokenService } from "../../../@common/services/token.service";
import { LoginDto, LoginSocialDto } from "../dto/login.dto";
import { Roles } from "src/@common/constants/role.constant";
import { User } from "src/entities/user/user.entity";
import { States } from "src/entities/@enums/index.enum";
import { Person } from "src/entities/user/person.entity";
import { Role } from "src/entities/user/role.entity";
import { UserRole } from "src/entities/user/user-role.entity";
import { Client } from "src/entities/client/client.entity";

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
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

  async loginSocialMedia(body: LoginSocialDto){
    const user = await this.userRepository.findOne({ email: body.email })

    if(!user){
      await getManager().transaction(async entityManager => {
        const user = await entityManager.save(this.userRepository.create({ 
          email: body.email,
          socialMedia: body.media
        }))
  
        await entityManager.save(this.personRepository.create({ 
          name: body.name, 
          lastname: body.lastname, 
          image: body.photo,
          user 
        }));
  
        const role = await this.roleRepository.findOne({ where: { key: Roles.CLIENT, state: States.Active } })

        await entityManager.save(this.userRoleRepository.create({ role, user }))
  
        await entityManager.save(this.clientRepository.create({ user, state: States.Active }))
      });

      return await this.tokenService.serializeToken(body.email);
    }

    if (user.state === States.Inactive)
      return { error: "USER_INACTIVE", message: "Usuario inactivo." }

    return await this.tokenService.serializeToken(user.email);
  }
}