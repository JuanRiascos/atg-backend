import { IsEmail, IsOptional } from 'class-validator';

export class EmailDto {

  @IsEmail()
  email: string;

  @IsOptional()
  url: string;
}