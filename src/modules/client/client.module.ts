import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interests } from 'src/entities/client/interests.entity';
import { ClientController } from './client.controller';
import { InterestService } from './services/interest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interests])
  ],
  controllers: [ClientController],
  providers: [InterestService]
})
export class ClientModule { }
