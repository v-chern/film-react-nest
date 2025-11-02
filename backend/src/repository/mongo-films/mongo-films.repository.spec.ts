import { Test, TestingModule } from '@nestjs/testing';
import { IFilmsRepository } from '../films.repository';
import { MongoFilmsRepository } from './mongo-films.repository';
import { Model } from 'mongoose';
import { IFilm } from './schema/films.schema';

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

describe('FilmsRepository', () => {
  let provider: IFilmsRepository;
  let filmModel: Model<IFilm>;

  let mockFilm;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoFilmsRepository,
        {
          provide: 'FilmModel',
          useValue: {
            find: jest.fn(),
            countDocuments: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    provider = module.get<IFilmsRepository>(MongoFilmsRepository);
    filmModel = module.get<Model<IFilm>>('FilmModel');

    mockFilm = {
      ...testFilms.items[0],
      schedule: [
        { ...testSessions.items[0], taken: [] },
        testSessions.items[1],
      ],
      save: jest.fn(),
    };
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should find all films in repository', async () => {
    (filmModel.find as jest.Mock).mockResolvedValueOnce(testFilms.items);
    (filmModel.countDocuments as jest.Mock).mockResolvedValueOnce(
      testFilms.total,
    );
    const films = await provider.findAll();
    expect(filmModel.find).toHaveBeenCalled();
    expect(filmModel.countDocuments).toHaveBeenCalled();
    expect(films).toEqual(testFilms);
  });

  it('should return empty collection when no films in repository', async () => {
    (filmModel.find as jest.Mock).mockResolvedValueOnce([]);
    (filmModel.countDocuments as jest.Mock).mockResolvedValueOnce(0);
    const films = await provider.findAll();
    expect(filmModel.find).toHaveBeenCalled();
    expect(filmModel.countDocuments).toHaveBeenCalled();
    expect(films).toEqual({
      total: 0,
      items: [],
    });
  });

  it('should find all sessions for a film', async () => {
    (filmModel.findOne as jest.Mock).mockResolvedValueOnce(mockFilm);
    const schedule = await provider.findFilmSchedule('film-id-123');
    expect(filmModel.findOne).toHaveBeenCalled();
    expect(schedule).toEqual(testSessions);
  });

  it('should return empty collection when no sessions for a film', async () => {
    (filmModel.findOne as jest.Mock).mockResolvedValueOnce(null);
    const schedule = await provider.findFilmSchedule('film-id-123');
    expect(filmModel.findOne).toHaveBeenCalled();
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
    (filmModel.findOne as jest.Mock).mockResolvedValue(mockFilm);

    const ticketId = await provider.reservePlace(
      'film-id-123',
      'session-id-456',
      '5:8',
    );

    expect(ticketId).toBe('5:8');
    expect(mockFilm.schedule[0].taken).toContain('5:8');
    expect(mockFilm.save).toHaveBeenCalled();
  });
});
