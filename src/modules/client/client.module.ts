import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientController } from './client.controller';
import { InterestService } from './services/interest.service';
import { Interest } from 'src/entities/academy/interest.entity';
import { Client } from 'src/entities/client/client.entity';
import { StatisticService } from './services/statistic.service';
import { SessionClient } from 'src/entities/client/session-client.entity';
import { SessionService } from './services/session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interest, Client, SessionClient])
  ],
  controllers: [ClientController],
  providers: [InterestService, StatisticService, SessionService]
})
export class ClientModule { }
