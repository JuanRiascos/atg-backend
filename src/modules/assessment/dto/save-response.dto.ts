import { IsArray, IsNumber, IsOptional } from "class-validator";

export class SaveResponseDto {

  @IsNumber()
  assessmentId: number

  @IsNumber()
  questionId: number

  @IsNumber()
  @IsOptional()
  tryId: number

  @IsArray()
  responses: any
}