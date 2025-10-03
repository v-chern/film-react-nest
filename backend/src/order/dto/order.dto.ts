import { IsString, IsEmail } from 'class-validator';

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
  tickets: ITicket[];
}
