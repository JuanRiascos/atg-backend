import { IsNumber } from "class-validator";

export class NotificationDto {

  @IsNumber()
  userId: number

}