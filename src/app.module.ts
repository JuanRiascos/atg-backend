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
import { ClientModule } from './modules/client/client.module';

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
    ClientModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
