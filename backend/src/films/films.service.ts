import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  findScheduleById(id: string) {
    return this.filmsRepository.findFilmSchedule(id);
  }

  findAll() {
    return this.filmsRepository.findAll();
  }
}
