import { Controller, Get, Param, Logger } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  private readonly logger = new Logger(FilmsController.name);
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAllFilms() {
    this.logger.log('Fetching all films');
    return await this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string) {
    this.logger.log(`Fetching schedule for film ${id}`);
    return await this.filmsService.findScheduleById(id);
  }
}
