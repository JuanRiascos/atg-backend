import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { TypesExtraReps } from "src/entities/@enums/index.enum";

export class ExtraDto {

  @IsNumber()
  @IsOptional()
  courseId: number

  @IsString()
  title: string

  @IsString()
  type: TypesExtraReps

  @IsBoolean()
  @IsOptional()
  free: boolean

  @IsString()
  typeDoc: string

  @IsString()
  @IsOptional()
  richText: string
}