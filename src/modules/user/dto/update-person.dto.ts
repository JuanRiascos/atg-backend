import { Length, IsString, IsJSON, IsEnum, IsOptional, IsEmail, isJSON } from 'class-validator';

export class UpdatePersonDto {

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsEmail()
  email: string

  @IsString()
  city: string;

  ocupation: any;

  @IsString()
  positionCurrentJob: string;

}