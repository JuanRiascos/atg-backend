import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"

export class VideoDto {

  @IsString()
  title: string

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