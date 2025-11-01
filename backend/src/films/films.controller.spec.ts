import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
    .overrideProvider(FilmsService)
    .useValue({
      findAll: jest.fn(),
      findScheduleById: jest.fn(),
    })
    .compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll from FilmsService', async () => {
    await controller.getAllFilms();
    expect(filmsService.findAll).toHaveBeenCalled();
  });

  it('should call findScheduleById from FilmsService', async () => {
    const filmId = 'film-id-123';
    await controller.getFilmSchedule(filmId);
    expect(filmsService.findScheduleById).toHaveBeenCalledWith(filmId);
  });
});
