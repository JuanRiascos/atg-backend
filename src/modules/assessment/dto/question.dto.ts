import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class QuestionDto {

  @IsNumber()
  @IsOptional()
  assessmentId: number

  @IsString()
  description: string

  @IsBoolean()
  @IsOptional()
  multiple: boolean
}