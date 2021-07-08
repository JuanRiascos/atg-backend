import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraReps } from 'src/entities/academy/extra-reps.entity';
import { ViewExtraReps } from 'src/entities/academy/views-extra-reps.entity';
import { ExtraController } from './extra.controller';
import { ExtraService } from './extra.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraReps, ViewExtraReps])],
  controllers: [ExtraController],
  providers: [ExtraService]
})
export class ExtraModule { }
