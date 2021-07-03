import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SessionClient } from "src/entities/client/session-client.entity";
import { Repository } from "typeorm";
import moment from 'moment'

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
        startTime: moment().format('HH:mm:ss')
      })
    } catch (error) {
      return { error }
    }

    return session
  }

  async finishSession(clientId: number, sessionId: number) {
    try {
      await this.sessionRepository.update(sessionId, {
        endTime: moment().format('HH:mm:ss')
      })
    } catch (error) {
      return { error }
    }

    return { message: 'finish session' }
  }

  async averageSessionTime() {

  }

}