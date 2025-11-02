import { Test, TestingModule } from '@nestjs/testing';
import { IFilmsRepository } from '../films.repository';
import { PostgresFilmsRepository } from './postgres-films.repository';

import { Repository } from 'typeorm';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import exp from 'constants';

const testFilms = {
  total: 1,
  items: [
    {
      id: 'film-id-123',
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Документальный'],
      image: '/bg1s.jpg',
      cover: '/bg1c.jpg',
      title: 'Архитекторы общества',
      about:
        'Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.',
      description:
        'Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.',
    },
  ],
};

const testSessions = {
  total: 2,
  items: [
    {
      id: 'session-id-456',
      daytime: '2024-06-28T10:00:53+03:00',
      hall: 0,
      rows: 5,
      seats: 10,
      price: 350,
      taken: [],
    },
    {
      id: 'session-id-789',
      daytime: '2024-06-28T14:00:53+03:00',
      hall: 1,
      rows: 5,
      seats: 10,
      price: 350,
      taken: [],
    },
  ],
};

describe('PostgresFilmsReporsitory', () => {
  let provider: IFilmsRepository;
  let filmRepository: Repository<FilmEntity>;
  let scheduleRepository: Repository<ScheduleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostgresFilmsRepository,
        {
          provide: 'FilmEntityRepository',
          useValue: {
            find: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: 'ScheduleEntityRepository',
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    provider = module.get<IFilmsRepository>(PostgresFilmsRepository);
    filmRepository = module.get<Repository<FilmEntity>>('FilmEntityRepository');
    scheduleRepository = module.get<Repository<ScheduleEntity>>(
      'ScheduleEntityRepository',
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should find all films in repository', async () => {
    (filmRepository.find as jest.Mock).mockResolvedValueOnce(testFilms.items);
    (filmRepository.count as jest.Mock).mockResolvedValueOnce(testFilms.total);
    const films = await provider.findAll();
    expect(filmRepository.find).toHaveBeenCalled();
    expect(filmRepository.count).toHaveBeenCalled();
    expect(films).toEqual(testFilms);
  });

  it('should return empty collection when no films in repository', async () => {
    (filmRepository.find as jest.Mock).mockResolvedValueOnce([]);
    (filmRepository.count as jest.Mock).mockResolvedValueOnce(0);
    const films = await provider.findAll();
    expect(filmRepository.find).toHaveBeenCalled();
    expect(filmRepository.count).toHaveBeenCalled();
    expect(films).toEqual({
      total: 0,
      items: [],
    });
  });

  it('should find all sessions for a film', async () => {
    (scheduleRepository.find as jest.Mock).mockResolvedValueOnce(
      testSessions.items,
    );
    const schedule = await provider.findFilmSchedule('film123');
    expect(scheduleRepository.find).toHaveBeenCalled();
    expect(schedule).toEqual(testSessions);
  });

  it('should return empty collection when no sessions for a film', async () => {
    (scheduleRepository.find as jest.Mock).mockResolvedValueOnce([]);
    const schedule = await provider.findFilmSchedule('film-id-123');
    expect(scheduleRepository.find).toHaveBeenCalled();
    expect(schedule).toEqual({
      total: 0,
      items: [],
    });
  });

  it('should throw an error when session is not found', async () => {
    await expect(
      provider.reservePlace('film-id-123', 'session-id-456', '5:8'),
    ).rejects.toThrow(
      new Error('Session session-id-456 for film film-id-123 not found'),
    );
  });

  it('should save taken place for a session', async () => {
    (scheduleRepository.findOne as jest.Mock).mockResolvedValueOnce(
      testSessions.items[0],
    );
    const ticketId = await provider.reservePlace(
      'film-id-123',
      'session-id-456',
      '5:8',
    );

    expect(ticketId).toBe('5:8');
    expect(scheduleRepository.save).toHaveBeenCalledWith({
      ...testSessions.items[0],
      taken: ['5:8'],
    });
  });
});
