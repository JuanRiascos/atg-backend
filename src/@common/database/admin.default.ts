import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignUpService } from "src/modules/auth/services/signup.service";
import { Roles } from "../constants/role.constant";
import { CryptoService } from "../services/crypto.service";
import { User } from "src/entities/user/user.entity";
import { States } from "src/entities/@enums/index.enum";

const ADMINS = [
  {
    name: "Super",
    lastname: "Admin",
    email: "admin@gmail.com",
    phone: "3144627922",
    password: "12345",
    superAdmin: true
  },
  {
    name: "Fabian",
    lastname: "Claros",
    email: "yeisonclaros99@gmail.com",
    phone: "3165425745",
    password: "12345",
    superAdmin: true
  }
]

export class AdminDefault {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly signupService: SignUpService,
    private readonly cryptoService: CryptoService
  ) {
    ADMINS.map(item => this._create(item))
  }

  async _create(_object) {
    const exist = await this.userRepository.createQueryBuilder('user')
      .innerJoin('user.roles', 'roles', 'roles.state = :stat', { stat: States.Active })
      .innerJoin('roles.role', 'role', 'role.key = :key', { key: Roles.ADMIN })
      .where('user.email = :email', { email: _object.email })
      .getOne()

    if (exist)
      return

    _object.email = _object.email.toLowerCase()
    _object.password = this.cryptoService.encrypt(_object.password);
    return await this.signupService.signupAdmin(_object)
  }
}