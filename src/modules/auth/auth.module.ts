import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../@common/strategys/jwt.strategy';
import { SignUpService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { PasswordService } from './services/password.service';
import { User } from 'src/entities/user/user.entity';
import { Person } from 'src/entities/user/person.entity';
import { Client } from 'src/entities/client/client.entity';
import { UserRole } from 'src/entities/user/user-role.entity';
import { Role } from 'src/entities/user/role.entity';
import { Permission } from 'src/entities/user/permission.entity';
import { UserPermission } from 'src/entities/user/user-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Person, 
      Client, 
      UserRole, 
      Role,
      Permission,
      UserPermission
    ]),
    JwtModule.registerAsync({ 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.key'),
        signOptions: { expiresIn: configService.get('jwt.expire') }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SignUpService,
    LoginService,
    PasswordService, 
  ],
  exports: [
    SignUpService
  ]
})
export class AuthModule { }
