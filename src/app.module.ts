import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter'
import appConfig from './@common/config/app.config';
import gcsConfig from './@common/config/gcs.config';
import sendgridConfig from './@common/config/sendgrid.config';
import typeormConfig from './@common/config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './@common/common.module';
import jwtConfig from './@common/config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from './modules/notification/notification.module';
import { InterestModule } from './modules/interest/interest.module';
import { ClientModule } from './modules/client/client.module';
import { CourseModule } from './modules/course/course.module';
import { ExtraModule } from './modules/extra/extra.module';
import { CaseModule } from './modules/case/case.module';
import { VideoModule } from './modules/video/video.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, gcsConfig, sendgridConfig, typeormConfig, jwtConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm')
    }),
    EventEmitterModule.forRoot(),
    CommonModule,
    AuthModule,
    UserModule,
    NotificationModule,
    InterestModule,
    ClientModule,
    CourseModule,
    ClientModule,
    ExtraModule,
    CaseModule,
    VideoModule,
    AssessmentModule,
    PaymentModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
