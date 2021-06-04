import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "src/entities/user/permission.entity";
import { Role } from "src/entities/user/role.entity";
import { User } from "src/entities/user/user.entity";
import { AuthModule } from "src/modules/auth/auth.module";
import { UserModule } from "src/modules/user/user.module";
import { CryptoService } from "./services/crypto.service";
import { SendgridService } from "./services/sendgrid.service";
import { TokenService } from "./services/token.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Permission, 
      Role
    ]),
    UserModule,
    AuthModule,
  ],
  providers: [
    CryptoService,
    SendgridService,
    TokenService
  ],
  exports: [
    CryptoService,
    SendgridService,
    TokenService
  ]
})

export class CommonModule { }