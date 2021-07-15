import { Length, IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {

  @IsEmail()
  email: string;

  @Length(3, 30)
  @IsOptional()
  password: string;

}

export class LoginSocialDto {

  @IsEmail()
  email: string;

  @Length(3, 30)
  name: string;

  @IsOptional()
  @Length(0, 30)
  lastname: string;

  @IsString()
  id: string;

  @IsString()
  photo: string;

  @IsString()
  media: string;
}