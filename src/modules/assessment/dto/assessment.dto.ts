import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Length } from "class-validator"

export class AssessmentDto {

  @IsOptional()
  @IsNumber()
  courseId: number

  @IsString()
  title: string

  @IsString()
  description: string

  @IsNumber()
  duration: number

  @IsString()
  instructions: string

  @IsOptional()
  @IsArray()
  questions: any

  @IsBoolean()
  @IsOptional()
  free: boolean
}