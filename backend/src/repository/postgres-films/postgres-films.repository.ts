import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFilmsRepository } from '../films.repository';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import {
  GetFilmDTO,
  GetFilmsDTO,
  GetSessionDTO,
  GetSessionsDTO,
} from '../../films/dto/films.dto';

@Injectable()
export class PostgresFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  private getFilmsMapperFn(): (FilmEntity) => GetFilmDTO {
    return (root) => {
      return {
        id: root.id,
        rating: root.rating,
        director: root.director,
        tags: root.tags,
        image: root.image,
        cover: root.cover,
        title: root.title,
        about: root.about,
        description: root.description,
      };
    };
  }

  private getFilmSessionsMapperFn(): (ScheduleEntity) => GetSessionDTO {
    return (root) => {
      return {
        id: root.id,
        daytime: root.daytime,
        hall: root.hall,
        rows: root.rows,
        seats: root.seats,
        price: root.price,
        taken: root.taken,
      };
    };
  }

  async findAll(): Promise<GetFilmsDTO> {
    const films = await this.filmRepository.find();
    const total = await this.filmRepository.count();
    return {
      total,
      items: films.map(this.getFilmsMapperFn()),
    };
  }

  async findFilmSchedule(filmId: string): Promise<GetSessionsDTO> {
    let retVal = {
      total: 0,
      items: [],
    };

    const schedules = await this.scheduleRepository.find({
      where: { film: { id: filmId } },
      order: { daytime: 'ASC' },
    });
    retVal = {
      total: schedules.length,
      items: schedules.map(this.getFilmSessionsMapperFn()),
    };
    return retVal;
  }

  async reservePlace(
    filmId: string,
    sessionId: string,
    place: string,
  ): Promise<string> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
    });
    if (!schedule) {
      throw new Error(`Session ${sessionId} for film ${filmId} not found`);
    }
    schedule.taken.push(place);
    await this.scheduleRepository.save(schedule);
    return place;
  }
}
