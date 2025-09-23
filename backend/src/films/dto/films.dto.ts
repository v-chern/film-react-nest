//TODO описать DTO для запросов к /films

export class GetFilmScheduleDTO {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: number[]
}

export class GetFilmsDTO {

}