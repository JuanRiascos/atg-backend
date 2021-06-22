import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"

export class AnswerDto {

  @IsNumber()
  @IsOptional()
  questionId: number

  @IsString()
  description: string

  @IsBoolean()
  correct: boolean
}