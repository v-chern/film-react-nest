import { Controller, Get, Param } from '@nestjs/common';

@Controller('films')
export class FilmsController {
  @Get()
  getAllFilms() {
    return {message: 'list of films'};
  }

  @Get(':id/schedule')
  getFilmSchedule(@Param('id') id: string) {
    return {message: `schedule for film ${id}`};
  }
}
