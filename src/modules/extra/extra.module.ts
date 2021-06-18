import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraReps } from 'src/entities/academy/extra-reps.entity';
import { ExtraController } from './extra.controller';
import { ExtraService } from './extra.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraReps])],
  controllers: [ExtraController],
  providers: [ExtraService]
})
export class ExtraModule { }
