import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFilm } from './schema/films.schema';
import {
  GetFilmDTO,
  GetFilmsDTO,
  GetSessionDTO,
  GetSessionsDTO,
} from '../films/dto/films.dto';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel('Film') private readonly filmModel: Model<IFilm>) {}
  private getFilmsMapperFn(): (FilmModel) => GetFilmDTO {
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

  private getFilmSessionsMapperFn(): (IFilmSchedule) => GetSessionDTO {
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
    const films = await this.filmModel.find();
    const total = await this.filmModel.countDocuments();
    return {
      total,
      items: films.map(this.getFilmsMapperFn()),
    };
  }

  async findFilmSchedule(filmId: string): Promise<GetSessionsDTO> {
    const film = await this.filmModel.findOne({ id: filmId });
    let retVal = {
      total: 0,
      items: [],
    };
    if (film) {
      retVal = {
        total: film.schedule.length,
        items: film.schedule.map(this.getFilmSessionsMapperFn()),
      };
    }
    return retVal;
  }

  async reservePlace(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<string> {
    const film = await this.filmModel.findOne({ id: filmId });
    const session = film.schedule.find((s) => s.id === scheduleId);
    session.taken.push(place);
    await film.save();
    return place;
  }
}
