import { IsNumber, IsOptional, IsString } from "class-validator";

export class CaseDto {

  @IsString()
  title: string

  @IsNumber()
  @IsOptional()
  courseId: number
}