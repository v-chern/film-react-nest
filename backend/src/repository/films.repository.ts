import { Injectable } from '@nestjs/common';
import mongoose, {Schema, Mongoose} from 'mongoose';

export interface IHallPlace {
  row: number;
  seat: number;
}

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

const FilmSchema = new mongoose.Schema({

});


//TODO: подключение к mongo для фильмов
@Injectable()
export class FilmsRepository {
  private films: IFilm[] = [{
    id: "0e33c7f6-27a7-4aa0-8e61-65d7e5effecf",
    rating: 2.9,
    director: "Итан Райт",
    tags: ["Документальный"],
    image: "/bg1s.jpg",
    cover: "/bg1c.jpg",
    title: "Архитекторы общества",
    about: "Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.",
    description: "Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.",
    schedule: [{
        id: "f2e429b0-685d-41f8-a8cd-1d8cb63b99ce",
        daytime: "2024-06-28T10:00:53+03:00",
        hall: 0,
        rows: 5,
        seats: 10,
        price: 350,
        taken: []
    }, {
        id: "5beec101-acbb-4158-adc6-d855716b44a8",
        daytime: "2024-06-28T14:00:53+03:00",
        hall: 1,
        rows: 5,
        seats: 10,
        price: 350,
        taken: []
    }]
  }, {
    id: "51b4bc85-646d-47fc-b988-3e7051a9fe9e",
    rating: 9,
    director: "Харрисон Рид",
    tags: ["Рекомендуемые"],
    image: "/bg3s.jpg",
    cover: "/bg3c.jpg",
    title: "Недостижимая утопия",
    about: "Провокационный фильм-антиутопия, исследующий темы свободы, контроля и цены совершенства.",
    description: "Провокационный фильм-антиутопия режиссера Харрисона Рида. Действие фильма разворачивается в, казалось бы, идеальном обществе, и рассказывает о группе граждан, которые начинают подвергать сомнению систему. Фильм исследует темы свободы, контроля и цены совершенства.",
    schedule: [{
        id: "9647fcf2-d0fa-4e69-ad90-2b23cff15449",
        daytime: "2024-06-28T10:00:53+03:00",
        hall: 0,
        rows: 5,
        seats: 10,
        price: 350,
        taken: []
    }]
  }];

  private getFilmSchedule(filmId: string, scheduleId: string): IFilmSchedule {
    const film = this.films.find(f => f.id === filmId);
    if (!film) throw new Error(`Film ${filmId} not found`);
    const schedule = film.schedule.find(s => s.id === scheduleId);
    if (!schedule) throw new Error(`Schedule ${scheduleId} not found for film ${filmId}`);
    return schedule;
  }

  findAll() {
    return this.films;
  }

  findById(id: string) {
    return this.films.find(film => film.id === id);
  }

  reservePlaceById(filmId: string, scheduleId: string, place: IHallPlace): string {
    const placeStr = `${place.row}:${place.seat}`;
    const schedule = this.getFilmSchedule(filmId, scheduleId);
    
    if (place.row > schedule.rows) {
      throw new Error(`Row ${place.row} exceeds total rows.`);
    }

    if (place.seat > schedule.seats) {
      throw new Error(`Seat ${place.seat} exceeds total seats.`);
    }

    if (schedule.taken.includes(placeStr)) {
      throw new Error(`Place row ${place.row} seat ${place.seat} is already taken.`);
    }

    schedule.taken.push(placeStr);
    
    return placeStr;
  }
}


