import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"

export class VideoDto {

  @IsString()
  title: string

  @IsString()
  @IsOptional()
  subtitle: string

  @IsString()
  @IsOptional()
  description: string

  @IsNumber()
  duration: number

  @IsString()
  url: string

  @IsNumber()
  @IsOptional()
  courseId: number

  @IsBoolean()
  @IsOptional()
  free: boolean
}