import { IsNumber, IsString } from "class-validator";

export class CheckDto {

  @IsString()
  description: string

  @IsNumber()
  videoId: number
}