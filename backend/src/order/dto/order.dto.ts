import { IsString, IsEmail, IsArray } from 'class-validator';

export interface ITicket {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDTO {
  @IsEmail()
  email: string;
  @IsString()
  phone: string;
  @IsArray()
  tickets: ITicket[];
}
