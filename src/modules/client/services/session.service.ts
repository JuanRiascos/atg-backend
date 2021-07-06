import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SessionClient } from "src/entities/client/session-client.entity";
import { Repository } from "typeorm";
import moment = require('moment');

@Injectable()
export class SessionService {

  constructor(
    @InjectRepository(SessionClient) private readonly sessionRepository: Repository<SessionClient>
  ) { }

  async initSession(clientId: number) {
    let session
    try {
      session = await this.sessionRepository.save({
        client: { id: clientId },
        startTime: new Date()
      })
    } catch (error) {
      return { error }
    }

    return session
  }

  async finishSession(clientId: number, sessionId: number) {
    try {
      await this.sessionRepository.update(sessionId, {
        endTime: new Date()
      })
    } catch (error) {
      return { error }
    }

    return { message: 'finish session' }
  }

  async averageSessionTime() {
    let sessions = await this.sessionRepository.createQueryBuilder('session')
      .getMany()

    let times = []
    let add = 0
    let average = 0
    for (const item of sessions) {
      if (!item.endTime)
        continue

      let endTime = moment(item.endTime, 'HH:mm:ss')
      let startTime = moment(item.startTime, 'HH:mm:ss')

      let diff = (+endTime.diff(startTime, 'seconds').toPrecision(4))
      add += diff
      times.push(diff)
    }

    average = add / times.length

    let minutesAverage = Math.floor((average / 60))
    var secondsAverage = Math.round(average % 60)

    return { minutesAverage, secondsAverage }
  }
}