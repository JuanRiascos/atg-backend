import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientController } from './client.controller';
import { InterestService } from './services/interest.service';
import { Interest } from 'src/entities/academy/interest.entity';
import { Client } from 'src/entities/client/client.entity';
import { StatisticService } from './services/statistic.service';
import { SessionClient } from 'src/entities/client/session-client.entity';
import { SessionService } from './services/session.service';
import { ViewCaseStudies } from 'src/entities/academy/views-case-studies.entity';
import { ViewExtraReps } from 'src/entities/academy/views-extra-reps.entity';
import { ViewVideos } from 'src/entities/academy/views-videos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interest, Client, SessionClient, ViewCaseStudies, ViewExtraReps, ViewVideos])
  ],
  controllers: [ClientController],
  providers: [InterestService, StatisticService, SessionService]
})
export class ClientModule { }
