import { IsArray, IsNumber, IsString } from 'class-validator';

export class GetSessionDTO {
  @IsString()
  id: string;
  @IsString()
  daytime: string;
  @IsNumber()
  hall: number;
  @IsNumber()
  rows: number;
  @IsNumber()
  seats: number;
  @IsNumber()
  price: number;
  @IsArray()
  @IsString({ each: true })
  taken: string[];
}

export class GetSessionsDTO {
  @IsNumber()
  total: number;
  @IsArray()
  items: GetSessionDTO[];
}

export class GetFilmDTO {
  @IsString()
  id: string;
  @IsNumber()
  rating: number;
  @IsString()
  director: string;
  @IsArray()
  @IsString({ each: true })
  tags: string[];
  @IsString()
  image: string;
  @IsString()
  cover: string;
  @IsString()
  title: string;
  @IsString()
  about: string;
  @IsString()
  description: string;
}

export class GetFilmsDTO {
  @IsNumber()
  total: number;
  @IsArray()
  items: GetFilmDTO[];
}
