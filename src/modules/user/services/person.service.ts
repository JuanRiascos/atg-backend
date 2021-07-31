import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


import { UpdatePersonDto } from "../dto/update-person.dto";
import { SendgridService, Templates } from "src/@common/services/sendgrid.service";
import { User } from "src/entities/user/user.entity";
import { Person } from "src/entities/user/person.entity";
import { States, StateSubscription } from "src/entities/@enums/index.enum";
import { Client } from "src/entities/client/client.entity";
import { ViewVideos } from "src/entities/academy/views-videos.entity";
import { ViewCaseStudies } from "src/entities/academy/views-case-studies.entity";
import { ViewExtraReps } from "src/entities/academy/views-extra-reps.entity";
import { SessionClient } from "src/entities/client/session-client.entity";
import moment = require('moment');

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    @InjectRepository(ViewVideos) private readonly viewVideosRepository: Repository<ViewVideos>,
    @InjectRepository(ViewCaseStudies) private readonly viewCasesRepository: Repository<ViewCaseStudies>,
    @InjectRepository(ViewExtraReps) private readonly viewExtrasRepository: Repository<ViewExtraReps>,
    @InjectRepository(SessionClient) private readonly sessionRepository: Repository<SessionClient>,
    private readonly sendgridService: SendgridService,
  ) { }

  async getPerson(id: number, clientId: number) {
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
      stateSubscription: userValidate?.client?.subscriptions?.length > 0 ?
        StateSubscription.Active
        :
        StateSubscription.Inactive
    }

    return response
  }

  async getMyAnalytics(clientId: number) {
    //Videos Watched
    let [videos, count] = await this.viewVideosRepository.createQueryBuilder('view')
      .addSelect(['video.id', 'video.duration'])
      .innerJoin('view.client', 'client', 'client.id = :clientId', { clientId })
      .innerJoin('view.video', 'video')
      .where('view.first = true')
      .getManyAndCount()

    //Watch Time
    let watchTime = ''
    let totalSeconds = 0
    for (const item of videos) {
      totalSeconds += item.video.duration
    }
    let totalMinutes = (totalSeconds / 60)
    if (totalMinutes >= 60) {
      let hourTime = Math.floor((totalMinutes / 60))
      let minutesTime = Math.round(totalMinutes % 60)
      watchTime = `${hourTime}hr ${minutesTime}min`
    } else {
      let minutesTime = Math.floor((totalSeconds / 60))
      let secondsTime = Math.round(totalSeconds % 60)
      watchTime = `${minutesTime}min ${secondsTime}secs`
    }

    //Resources Viewed
    let casesViewed = await this.viewCasesRepository.createQueryBuilder('view')
      .innerJoin('view.client', 'client', 'client.id = :clientId', { clientId })
      .where('view.first = true')
      .getCount()
    let extrasViewed = await this.viewExtrasRepository.createQueryBuilder('view')
      .innerJoin('view.client', 'client', 'client.id = :clientId', { clientId })
      .where('view.first = true')
      .getCount()
    let resourcesViewed = casesViewed + extrasViewed

    //TimeInApp
    let sessions = await this.sessionRepository.createQueryBuilder('session')
      .innerJoin('session.client', 'client', 'client.id = :clientId', { clientId })
      .getMany()
    let add = 0
    for (const item of sessions) {
      if (!item.endTime)
        continue
      let endTime = moment(item.endTime, 'HH:mm:ss')
      let startTime = moment(item.startTime, 'HH:mm:ss')
      let diff = +Math.abs(moment.duration(endTime.diff(startTime)).as('minutes')).toPrecision(4)
      add += diff
    }
    let hours = Math.floor((add / 60))
    var minutes = Math.round(add % 60)

    return {
      videosWatched: count,
      resourcesViewed,
      timeInApp: `${hours}hr ${minutes}min`,
      watchTime
    }

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