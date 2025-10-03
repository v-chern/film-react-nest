import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';


@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {};

  @Get()
  getAllFilms() {
    const films = this.filmsService.findAll();
    const retVal = {
      total: films.length, 
      items: films.map(({ schedule, ...rest }) => rest)
    }
    return retVal;
  }

  @Get(':id/schedule')
  getFilmSchedule(@Param('id') id: string) {
    const schedule = this.filmsService.findScheduleById(id);
    const retVal = {
      total: schedule.length, 
      items: schedule
    }
    return retVal;
  }
}
