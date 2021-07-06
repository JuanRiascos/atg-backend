import { Length, IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {

  @IsEmail()
  email: string;

  @Length(3, 30)
  @IsOptional()
  password: string;

}
