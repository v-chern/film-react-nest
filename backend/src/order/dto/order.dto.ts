//TODO реализовать DTO для /orders
import { IsString, IsNumber } from "class-validator";

export class CreateOrderDTO {
  @IsString()
  name: string;
  @IsNumber()
  count: number;
}