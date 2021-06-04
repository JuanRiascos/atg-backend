import { IsNotEmpty, IsString } from 'class-validator';

export class NewPasswordDto {

  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  password: string;

}