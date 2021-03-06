import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/entities/academy/answer.entity';
import { AssessmentClientTry } from 'src/entities/academy/assessment-client-try.entity';
import { Assessment } from 'src/entities/academy/assessment.entity';
import { ClientQuestion } from 'src/entities/academy/client-question.entity';
import { Question } from 'src/entities/academy/question.entity';
import { AssessmentController } from './assessment.controller';
import { AnswerService } from './services/answer.service';
import { AssessmentService } from './services/assessment.service';
import { QuestionService } from './services/question.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assessment, Question, Answer, AssessmentClientTry, ClientQuestion]),
    JwtModule.registerAsync({ 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.key'),
        signOptions: { expiresIn: configService.get('jwt.expire') }
      })
    })
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService, QuestionService, AnswerService]
})
export class AssessmentModule { }
