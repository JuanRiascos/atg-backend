import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientController } from './client.controller';
import { InterestService } from './services/interest.service';
import { Interest } from 'src/entities/academy/interest.entity';
import { Client } from 'src/entities/client/client.entity';
import { StatisticService } from './services/statistic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interest, Client])
  ],
  controllers: [ClientController],
  providers: [InterestService, StatisticService]
})
export class ClientModule { }
