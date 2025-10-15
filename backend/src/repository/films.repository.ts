import { GetFilmsDTO, GetSessionsDTO } from '../films/dto/films.dto';

export interface IFilmsRepository {
  findAll(): Promise<GetFilmsDTO>;
  findFilmSchedule(filmId: string): Promise<GetSessionsDTO>;
  reservePlace(
    filmId: string,
    sessionId: string,
    place: string,
  ): Promise<string>;
}
