import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  findScheduleById(id: string) {
    const film = { ...this.filmsRepository.findById(id) };
    return film.schedule;
  }

  findAll() {
    return this.filmsRepository.findAll();
  }
}
