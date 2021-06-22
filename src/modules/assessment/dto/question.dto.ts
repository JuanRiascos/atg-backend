import { IsNumber, IsOptional, IsString } from "class-validator";

export class QuestionDto {

  @IsNumber()
  @IsOptional()
  assessmentId: number

  @IsString()
  description: string
}