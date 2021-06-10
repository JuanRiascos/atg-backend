import { IsNumber, IsOptional, IsString } from "class-validator"

export class CategoryDto {

  @IsString()
  title: string

  @IsString()
  @IsOptional()
  description: string

  @IsNumber()
  @IsOptional()
  parentId: number
}