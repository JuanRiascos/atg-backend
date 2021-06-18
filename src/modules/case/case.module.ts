import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseStudies } from 'src/entities/academy/case-studies.entity';
import { CaseController } from './case.controller';
import { CaseService } from './case.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaseStudies])],
  controllers: [CaseController],
  providers: [CaseService]
})
export class CaseModule {}
