import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { IFilmsRepository } from '../repository/films.repository';
import { NotFoundException } from '@nestjs/common';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: IFilmsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmsService, {
        provide: 'IFilmsRepository',
        useValue: { 
          findFilmSchedule: jest.fn(),
          findAll: jest.fn()
        }
      }],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<IFilmsRepository>('IFilmsRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findFilmSchedule from repository and process existing schedule', async () => {
    (repository.findFilmSchedule as jest.Mock).mockReturnValueOnce({ total: 2, sessions: ['session_1', 'session_2'] });
    const filmId = 'film-id-123';
    const sessions = await service.findScheduleById(filmId);
    expect(repository.findFilmSchedule).toHaveBeenCalledWith(filmId);
    expect(sessions).toEqual({ total: 2, sessions: ['session_1', 'session_2'] });
  });

  it('should throw NotFoundException when film is not existing', async () => {
    (repository.findFilmSchedule as jest.Mock).mockReturnValueOnce({ total: 0, sessions: [] });
    const filmId = 'non-existing-film-id';
    await expect(service.findScheduleById(filmId)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findFilmSchedule).toHaveBeenCalledWith(filmId);
  });

  it('should call findAll from repository and process existing films', async () => {
    (repository.findAll as jest.Mock).mockReturnValueOnce({ total: 3, films: ['film_1', 'film_2', 'film_3'] });
    const films = await service.findAll();
    expect(repository.findAll).toHaveBeenCalled();
    expect(films).toEqual({ total: 3, films: ['film_1', 'film_2', 'film_3'] });
  });

  it('should throw NotFoundException when no films are found', async () => {
    (repository.findAll as jest.Mock).mockReturnValueOnce({ total: 0, films: [] });
    await expect(service.findAll()).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
