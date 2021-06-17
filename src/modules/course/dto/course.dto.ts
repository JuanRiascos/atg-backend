import { IsString } from "class-validator"

export class CourseDto {
  
  @IsString()
  title: string

  @IsString()
  subtitle: string

  @IsString()
  color: string
}