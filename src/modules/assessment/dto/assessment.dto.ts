import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Length } from "class-validator"

export class AssessmentDto {

  @IsOptional()
  @IsNumber()
  courseId: number

  @IsString()
  title: string

  @IsString()
  @Length(10, 300)
  description: string

  @IsNumber()
  duration: number

  @IsString()
  @Length(10, 300)
  instructions: string

  @IsOptional()
  @IsArray()
  questions: any

  @IsBoolean()
  @IsOptional()
  free: boolean
}