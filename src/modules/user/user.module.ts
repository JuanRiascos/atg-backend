import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { PermissionsService } from './services/permissions.service';
import { PersonService } from './services/person.service';
import { User } from 'src/entities/user/user.entity';
import { Person } from 'src/entities/user/person.entity';
import { UserRole } from 'src/entities/user/user-role.entity';
import { UserPermission } from 'src/entities/user/user-permission.entity';
import { FindService } from './services/find.service';
import { ManageService } from './services/manage.service';
import { Client } from 'src/entities/client/client.entity';
import { Ocupation } from 'src/entities/user/ocupation.entity';
import { OcupationService } from './services/ocupation.service';
import { Sport } from 'src/entities/user/sport.entity';
import { SportService } from './services/sport.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Person,
      Client,
      Ocupation,
      Sport,
      UserRole,
      UserPermission
    ])
  ],
  controllers: [UserController],
  providers: [
    PermissionsService,
    PersonService,
    FindService,
    ManageService,
    OcupationService,
    SportService
  ],
  exports: [PermissionsService]
})
export class UserModule { }
