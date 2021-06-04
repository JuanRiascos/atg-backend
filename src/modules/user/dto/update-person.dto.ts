import { Length, IsString, IsDate, IsEnum, IsOptional, IsEmail } from 'class-validator';

export class UpdatePersonDto {

  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @Length(2, 50)
  lastname: string;

  @IsOptional()
  @IsEmail()
  email: string

  @IsString()
  @Length(9, 15)
  phone: string;

}