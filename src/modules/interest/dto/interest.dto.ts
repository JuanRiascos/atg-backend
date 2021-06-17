import { IsNumber, IsOptional, IsString } from "class-validator"

export class InterestDto {

  @IsString()
  title: string

  @IsString()
  @IsOptional()
  description: string

  @IsNumber()
  @IsOptional()
  parentId: number
}