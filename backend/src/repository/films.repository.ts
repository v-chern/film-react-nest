import { Injectable, Inject } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { IFilm, IHallPlace, FilmSchema } from './schema/films.schema';
import {
  GetFilmDTO,
  GetFilmsDTO,
  GetSessionDTO,
  GetSessionsDTO,
} from '../films/dto/films.dto';
import { AppConfig } from '../app.config.provider';

@Injectable()
export class FilmsRepository {
  private filmModel: Model<IFilm>;

  constructor(@Inject('CONFIG') private readonly config: AppConfig) {
    const connection = mongoose.createConnection(this.config.database.url);
    this.filmModel = connection.model<IFilm>('Film', FilmSchema);
  }

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
    if (!film) {
      throw new Error(`Film ${filmId} not found`);
    }
    return {
      total: film.schedule.length,
      items: film.schedule.map(this.getFilmSessionsMapperFn()),
    };
  }

  async reservePlace(
    filmId: string,
    scheduleId: string,
    place: IHallPlace,
  ): Promise<string> {
    const placeStr = `${place.row}:${place.seat}`;

    const film = await this.filmModel.findOne({ id: filmId });
    if (!film) {
      throw new Error(`Film ${filmId} not found`);
    }

    const session = film.schedule.find((s) => s.id === scheduleId);
    if (!session) {
      throw new Error(`Session ${scheduleId} not found for film ${filmId}`);
    }

    if (place.row > session.rows) {
      throw new Error(`Row ${place.row} exceeds total rows.`);
    }

    if (place.seat > session.seats) {
      throw new Error(`Seat ${place.seat} exceeds total seats.`);
    }

    if (session.taken.includes(placeStr)) {
      throw new Error(
        `Place row ${place.row} seat ${place.seat} is already taken for session ${scheduleId} film ${filmId}.`,
      );
    }

    session.taken.push(placeStr);
    await film.save();

    return placeStr;
  }
}
