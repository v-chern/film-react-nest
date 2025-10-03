import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDTO } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(orderData: CreateOrderDTO) {
    let retVal = {
      total: orderData.tickets.length, 
      items: []
    }
    for (const ticket of orderData.tickets) {
      const film = ticket.film;
      const session = ticket.session;
      const place = {
        row: ticket.row,
        seat: ticket.seat
      } 
      await this.filmsRepository.reservePlaceById(film, session, place);
      retVal.items.push({...ticket, id: 'abc123'});
    }
    return retVal;
  }

}
