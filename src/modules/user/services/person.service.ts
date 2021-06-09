import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


import { UpdatePersonDto } from "../dto/update-person.dto";
import { SendgridService, Templates } from "src/@common/services/sendgrid.service";
import { User } from "src/entities/user/user.entity";
import { Person } from "src/entities/user/person.entity";
import { States } from "src/entities/@enums/index.enum";

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    private readonly sendgridService: SendgridService,
  ) { }

  async getPerson(id: number) {
    const userValidate: any = await this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.email'])
      .innerJoinAndSelect('user.person', 'person')
      .where("user.state = 'active' AND user.id = :id", { id })
      .getOne()

    if (!userValidate)
      return { error: 'USER_INACTIVE', message: 'El usuario se encuentra inactivo.' }

    delete userValidate.person.id

    const response = {
      email: userValidate.email,
      ...userValidate.person
    }

    return response
  }

  async updatePerson(id: number, body: UpdatePersonDto) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email'],
      join: {
        alias: 'user',
        innerJoinAndSelect: { person: 'user.person' }
      },
      where: { id, state: States.Active }
    })

    if (!user)
      return { error: 'USER_INACTIVE', message: 'El usuario se encuentra inactivo.' }

    if (user.email !== body.email) {
      let emailAvailable = await this.userRepository.findOne({
        where: { email: body.email }
      })
      if (emailAvailable)
        return { error: 'ERROR_UPDATE', message: 'Ocurrio un problema al actualizar los datos.' }

      const update = await this.userRepository.update(user.id, { email: body.email })
      if (update.affected !== 1)
        return { error: 'ERROR_UPDATE', message: 'Ocurrio un problema al actualizar los datos.' }

      await this.sendgridService.sendEmail(
        body.email,
        Templates.SIGNUP_SUCCESS,
        {
          clientName: body.name + ' ' + body.lastname
        })
    }

    delete body.email
    const update = await this.personRepository.update(user.person.id, body);
    if (update.affected !== 1)
      return { error: 'ERROR_UPDATE', message: 'Ocurrio un problema al actualizar los datos.' }

    return update
  }

}