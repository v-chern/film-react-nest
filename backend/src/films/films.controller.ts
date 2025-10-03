import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getAllFilms() {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string) {
    let sessons = {};
    try {
      sessons = await this.filmsService.findScheduleById(id);
    } catch (error) {
      throw new HttpException(
        {
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return sessons;
  }
}
