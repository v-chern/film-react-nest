import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDTO } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(orderData: CreateOrderDTO) {
    const retVal = {
      total: orderData.tickets.length,
      items: [],
    };
    for (const ticket of orderData.tickets) {
      const filmId = ticket.film;
      const sessionId = ticket.session;
      const place = `${ticket.row}:${ticket.seat}`;

      const schedule = await this.filmsRepository.findFilmSchedule(filmId);
      console.log('SCHEDULE', schedule);
      if (schedule.total === 0) {
        throw new NotFoundException({
          error: `No sessions found for film ${filmId}`,
        });
      }
      const session = schedule.items.find((item) => item.id === sessionId);
      if (!session) {
        throw new NotFoundException({
          error: `Session ${sessionId} not found for film ${filmId}`,
        });
      }
      if (ticket.row > session.rows) {
        throw new BadRequestException({
          error: `Row ${ticket.row} exceeds total rows.`,
        });
      }

      if (ticket.seat > session.seats) {
        throw new BadRequestException({
          error: `Seat ${ticket.seat} exceeds total seats.`,
        });
      }

      if (session.taken.includes(place)) {
        throw new ConflictException({
          error: `Place row ${ticket.row} seat ${ticket.seat} is already taken for session ${sessionId} film ${filmId}.`,
        });
      }

      const ticketId = await this.filmsRepository.reservePlace(
        filmId,
        sessionId,
        place,
      );
      retVal.items.push({ ...ticket, id: ticketId });
    }
    return retVal;
  }
}
