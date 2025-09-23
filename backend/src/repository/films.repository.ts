import { Injectable } from '@nestjs/common';

export interface IFilmSchedule {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface IFilm {
  id:string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: IFilmSchedule[];

}


//TODO: подключение к mongo для фильмов
@Injectable()
export class FilmsRepository {

  findAll() {
    return [];
  }

  findById(id: string) {
    return {};
  }
}
