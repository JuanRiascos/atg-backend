import { IsNotEmpty, IsString } from 'class-validator';

export class NewPassworAuthenticatedDto {

  @IsString()
  @IsNotEmpty()
  password: string;
}