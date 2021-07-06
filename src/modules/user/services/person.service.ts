import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


import { UpdatePersonDto } from "../dto/update-person.dto";
import { SendgridService, Templates } from "src/@common/services/sendgrid.service";
import { User } from "src/entities/user/user.entity";
import { Person } from "src/entities/user/person.entity";
import { States, StateSubscription } from "src/entities/@enums/index.enum";
import { Client } from "src/entities/client/client.entity";

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    private readonly sendgridService: SendgridService,
  ) { }

  async getPerson(id: number) {
    const userValidate = await this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.tokenExpo'])
      .addSelect(['client.city', 'client.id'])
      .innerJoinAndSelect('user.person', 'person')
      .leftJoin('user.client', 'client')
      .leftJoinAndSelect(
        'client.subscriptions',
        'subscription',
        'subscription.stateSubscription IN (:...stateSubscription)',
        {
          stateSubscription: [StateSubscription.Active, StateSubscription.Canceled]
        }
      )
      .leftJoinAndSelect('person.ocupation', 'ocupation')
      .leftJoinAndSelect('person.sport', 'sport')
      .where("user.state = 'active' AND user.id = :id", { id })
      .getOne()

    if (!userValidate)
      return { error: 'USER_INACTIVE', message: 'El usuario se encuentra inactivo.' }

    const atgAppClientId = userValidate?.client?.id

    delete userValidate?.person?.id
    delete userValidate?.client?.id

    const response = {
      email: userValidate?.email,
      tokenExpo: userValidate?.tokenExpo,
      ...userValidate?.person,
      ...userValidate?.client,
      atgAppClientId,
      stateSubscription: userValidate?.client?.subscriptions?.length ?
        StateSubscription.Active
        :
        StateSubscription.Inactive
    }

    return response
  }

  async updatePerson(id: number, body: UpdatePersonDto) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email'],
      relations: ["client", "person"],
      where: { id, state: States.Active }
    })

    if (!user)
      return { error: 'USER_INACTIVE', message: 'El usuario se encuentra inactivo.' }

    if (body.email && (user.email !== body.email)) {
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

    const updateClient = await this.clientRepository.update(user?.client?.id, { city: body.city })

    if (updateClient.affected !== 1)
      return { error: 'ERROR_UPDATE', message: 'Ocurrio un problema al actualizar los datos.' }

    delete body.email
    delete body.city

    const update = await this.personRepository.update(user?.person?.id, body);
    if (update.affected !== 1)
      return { error: 'ERROR_UPDATE', message: 'Ocurrio un problema al actualizar los datos.' }

    return update
  }

  async updatePhotoProfile(userAuntenticated, imageUrl: string) {
    if (!imageUrl)
      return { error: 'ERROR_UPLOAD_IMAGE', message: 'No se pudo cargar la imagen.' }

    let body

    const user = await this.userRepository.findOne({
      select: ['id', 'email'],
      join: {
        alias: 'user',
        innerJoinAndSelect: { person: 'user.person' }
      },
      where: { id: userAuntenticated?.id, state: States.Active }
    })

    if (!user)
      return { error: 'USER_INACTIVE', message: 'El usuario se encuentra inactivo.' }

    if (imageUrl)
      body = { image: imageUrl }

    const update = await this.personRepository.update(user?.person?.id, body);

    if (update?.affected !== 1)
      return { error: 'ERROR_UPDATE', message: 'Ocurrio un problema al actualizar los datos.' }

    return update
  }

}