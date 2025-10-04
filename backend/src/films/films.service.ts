import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findScheduleById(id: string) {
    const sessions = await this.filmsRepository.findFilmSchedule(id);
    if (!sessions || sessions.total === 0) {
      throw new NotFoundException({
        error: `No sessions found for film ${id}`,
      });
    }
    return sessions;
  }

  async findAll() {
    const films = await this.filmsRepository.findAll();
    if (!films || films.total === 0) {
      throw new NotFoundException({ error: 'No films found' });
    }
    return films;
  }
}
