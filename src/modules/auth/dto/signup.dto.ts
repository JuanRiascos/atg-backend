import { IsEmail, Length, IsString, IsEnum, IsOptional, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { Roles } from '../../../@common/constants/role.constant';

export class SignupDto {

  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @Length(2, 50)
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @Length(9, 15)
  phone: string;

  @Length(3, 30)
  password: string;

  @IsString()
  @IsEnum(Roles)
  @IsOptional()
  role: string

  @IsBoolean()
  @IsOptional()
  superAdmin: boolean

}