import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { PermissionsService } from './services/permissions.service';
import { PersonService } from './services/person.service';
import { User } from 'src/entities/user/user.entity';
import { Person } from 'src/entities/user/person.entity';
import { UserRole } from 'src/entities/user/user-role.entity';
import { UserPermission } from 'src/entities/user/user-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Person,
      UserRole,
      UserPermission
    ])
  ],
  controllers: [UserController],
  providers: [
    PermissionsService,
    PersonService,
  ],
  exports: [PermissionsService]
})
export class UserModule { }
