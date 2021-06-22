import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/entities/academy/answer.entity';
import { Assessment } from 'src/entities/academy/assessment.entity';
import { Question } from 'src/entities/academy/question.entity';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './services/assessment.service';
import { QuestionService } from './services/question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment, Question, Answer])],
  controllers: [AssessmentController],
  providers: [AssessmentService, QuestionService]
})
export class AssessmentModule {}
