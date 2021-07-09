import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { States, StateSubscription } from "src/entities/@enums/index.enum";
import { Client } from "src/entities/client/client.entity";
import { Repository } from "typeorm";
import * as XLSX from 'xlsx';
import moment = require('moment');
import { ViewCaseStudies } from "src/entities/academy/views-case-studies.entity";
import { ViewExtraReps } from "src/entities/academy/views-extra-reps.entity";
import { ViewVideos } from "src/entities/academy/views-videos.entity";


@Injectable()
export class StatisticService {

  constructor(
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    @InjectRepository(ViewCaseStudies) private readonly viewCaseRepository: Repository<ViewCaseStudies>,
    @InjectRepository(ViewExtraReps) private readonly viewExtraRepository: Repository<ViewExtraReps>,
    @InjectRepository(ViewVideos) private readonly viewVideosRepository: Repository<ViewVideos>
  ) { }

  async getRegisteredClients() {
    let clients
    try {
      clients = await this.clientRepository.createQueryBuilder('client')
        .innerJoin('client.user', 'user', 'user.state = :stat', { stat: States.Active })
        .where('client.state = :state', { state: States.Active })
        .getCount()
    } catch (error) {
      return { error }
    }

    return clients
  }

  async getPaidClients() {
    let clients
    try {
      clients = await this.clientRepository.createQueryBuilder('client')
        .innerJoin('client.user', 'user', 'user.state = :stat', { stat: States.Active })
        .innerJoin(
          'client.subscriptions',
          'subscription',
          'subscription.stateSubscription IN (:...stateSubscription)',
          {
            stateSubscription: [StateSubscription.Active, StateSubscription.Canceled]
          }
        )
        .where('client.state = :state', { state: States.Active })
        .getCount()
    } catch (error) {
      return { error }
    }

    return clients
  }

  async getClientsByDate(query: any) {
    const { initDate, finishDate } = query

    let result = []
    let aux = true
    let init = initDate

    let quantity = 0
    while (aux) {
      if (moment(init).get('month') == moment(finishDate).get('month')) {
        aux = false
      }

      quantity = await this.clientRepository.createQueryBuilder('client')
        .leftJoin('client.user', 'user')
        .where(`user.created_at BETWEEN 
          '${moment(init).startOf('month').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)}' AND 
          '${moment(init).endOf('month').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)}'`)
        .getCount() + quantity

      result.push({
        date: moment(init).format('MMM/YYYY'),
        quantity
      })

      init = moment(init).add(1, 'month')
    }

    return result
  }

  async getReportData() {
    const clients = await this.clientRepository.createQueryBuilder('client')
      .select(['client.id', 'client.city'])
      .addSelect(['user.id', 'user.email', 'user.createdAt'])
      .addSelect(['person.name', 'person.lastname', 'person.phone', 'person.positionCurrentJob'])
      .addSelect(['ocupation.name'])
      .addSelect(['sport.name'])
      .innerJoin('client.user', 'user')
      .innerJoin('user.person', 'person')
      .leftJoin('person.ocupation', 'ocupation')
      .leftJoin('person.sport', 'sport')
      .addOrderBy('user.createdAt')
      .getMany()

    let fileName = 'users-data.xlsx'

    let data = clients.map(client => {
      return [
        client.id, `${client.user.person.name} ${client.user.person.lastname}`,
        client.user.email, client.user.createdAt, client.user.person.phone, client.city?.name,
        client.user.person.ocupation?.name, client.user.person.sport?.name,
        client.user.person.positionCurrentJob
      ]
    })

    var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      [
        'Client Id', 'Name and Lastname', 'Email',
        'Register Date', 'Phone', 'City', 'Ocupation', 'Sport', 'Position/Current Job'
      ],
      ...data
    ]);
    var wb: XLSX.WorkBook = { Sheets: { 'UsersData': ws }, SheetNames: ['UsersData'] };
    var file = XLSX.writeFile(wb, fileName, { bookType: 'xlsx' })

    return { file, fileName }
  }

  async getContenView() {
    const videos = await this.viewVideosRepository.createQueryBuilder('view')
      .select(['view.date'])
      .addSelect(['video.title', 'course.title', 'client.id'])
      .innerJoin('view.video', 'video')
      .innerJoin('video.course', 'course')
      .innerJoin('view.client', 'client')
      .where('view.first = true')
      .orderBy('view.date')
      .getMany()

    const extras = await this.viewExtraRepository.createQueryBuilder('view')
      .select(['view.date'])
      .addSelect(['extraRep.title', 'course.title', 'client.id'])
      .innerJoin('view.extraRep', 'extraRep')
      .innerJoin('extraRep.course', 'course')
      .innerJoin('view.client', 'client')
      .where('view.first = true')
      .orderBy('view.date')
      .getMany()

    const cases = await this.viewCaseRepository.createQueryBuilder('view')
      .select(['view.date'])
      .addSelect(['caseStudy.title', 'course.title', 'client.id'])
      .innerJoin('view.caseStudy', 'caseStudy')
      .innerJoin('caseStudy.course', 'course')
      .innerJoin('view.client', 'client')
      .where('view.first = true')
      .orderBy('view.date')
      .getMany()

    let dataVideos = videos.map(item => {
      return [
        item.video.course.title, item.video.title, 'Video',
        moment(item.date).format('DD MMM YYYY'), moment(item.date).format('LT'),
        item.client.id
      ]
    })

    let dataExtras = extras.map(item => {
      return [
        item.extraRep.course.title, item.extraRep.title, 'Extra Rep',
        moment(item.date).format('DD MMM YYYY'), moment(item.date).format('LT'),
        item.client.id
      ]
    })

    let dataCases = cases.map(item => {
      return [
        item.caseStudy.course.title, item.caseStudy.title, 'Case Study',
        moment(item.date).format('DD MMM YYYY'), moment(item.date).format('LT'),
        item.client.id
      ]
    })

    let fileName = 'viewed-content.xlsx'
    var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      [
        'Categorie', 'Name', 'Content Type', 'Date Viewed', 'Time Viewed', 'Client Id'
      ],
      ...dataVideos,
      ...dataExtras,
      ...dataCases
    ]);
    var wb: XLSX.WorkBook = { Sheets: { 'ViewedContent': ws }, SheetNames: ['ViewedContent'] };
    var file = XLSX.writeFile(wb, fileName, { bookType: 'xlsx' })

    return { file, fileName }
  }
}