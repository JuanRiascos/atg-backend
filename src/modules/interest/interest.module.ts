import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from 'src/entities/academy/interest.entity';
import { InterestController } from './interest.controller';
import { InterestService } from './interest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interest]),
    JwtModule.registerAsync({ 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.key'),
        signOptions: { expiresIn: configService.get('jwt.expire') }
      })
    })
  ],
  controllers: [InterestController],
  providers: [InterestService]
})
export class InterestModule { }
