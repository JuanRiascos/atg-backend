import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CaseDto {

  @IsString()
  title: string

  @IsNumber()
  @IsOptional()
  courseId: number

  @IsBoolean()
  @IsOptional()
  free: boolean

  @IsString()
  typeDoc: string

  @IsString()
  @IsOptional()
  richText: string
}