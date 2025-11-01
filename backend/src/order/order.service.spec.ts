import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { IFilmsRepository } from '../repository/films.repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

const testOrderData = {
  email: 'test@test.ts',
  phone: '1234567890',
  tickets: [
    {
      film: 'film-id-123',
      session: 'session-id-456',
      daytime: '2025-10-31T20:00:00Z',
      row: 5,
      seat: 8,
      price: 12.5,
    },
  ]
}

describe('OrderService', () => {
  let service: OrderService;
  let filmsRepository: IFilmsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, {
        provide: 'IFilmsRepository',
        useValue: {
          findFilmSchedule: jest.fn(),
          reservePlace: jest.fn()
        }
      }],
    }).compile();

    service = module.get<OrderService>(OrderService);
    filmsRepository = module.get<IFilmsRepository>('IFilmsRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if no sessions found for film', async () => {
    (filmsRepository.findFilmSchedule as jest.Mock).mockResolvedValueOnce({ total: 0, items: [] });

    await expect(service.createOrder(testOrderData)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if session not found for film', async () => {
    (filmsRepository.findFilmSchedule as jest.Mock).mockResolvedValueOnce({
      total: 1,
      items: [
        {
          id: 'other-session-id',
          daytime: '2025-10-31T20:00:00Z',
          hall: 'Hall 1',
          rows: 10,
          seats: 10,
          price: 12.5,
          taken: [],
        },
      ],
    });

    await expect(service.createOrder(testOrderData)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException if row exceeds total rows', async () => {
    (filmsRepository.findFilmSchedule as jest.Mock).mockResolvedValueOnce({
      total: 1,
      items: [
        {
          id: 'session-id-456',
          daytime: '2025-10-31T20:00:00Z',
          hall: 'Hall 1',
          rows: 4,
          seats: 10,
          price: 12.5,
          taken: [],
        },
      ],
    });

    await expect(service.createOrder(testOrderData)).rejects.toThrow(
      BadRequestException
    );
  });

    it('should throw BadRequestException if seat exceeds total seats', async () => {
    (filmsRepository.findFilmSchedule as jest.Mock).mockResolvedValueOnce({
      total: 1,
      items: [
        {
          id: 'session-id-456',
          daytime: '2025-10-31T20:00:00Z',
          hall: 'Hall 1',
          rows: 10,
          seats: 4,
          price: 12.5,
          taken: [],
        },
      ],
    });

    await expect(service.createOrder(testOrderData)).rejects.toThrow(
      BadRequestException
    );
  });

  it('should throw ConflictException if place is already taken', async () => {
    (filmsRepository.findFilmSchedule as jest.Mock).mockResolvedValueOnce({
      total: 1,
      items: [
        {
          id: 'session-id-456',
          daytime: '2025-10-31T20:00:00Z',
          hall: 'Hall 1',
          rows: 10,
          seats: 10,
          price: 12.5,
          taken: ['5:8'],
        },
      ],
    });

    await expect(service.createOrder(testOrderData)).rejects.toThrow(
      ConflictException
    );
  });

  it('should call repository reservePlace', async () => {
    (filmsRepository.findFilmSchedule as jest.Mock).mockResolvedValueOnce({
      total: 1,
      items: [
        {
          id: 'session-id-456',
          daytime: '2025-10-31T20:00:00Z',
          hall: 'Hall 1',
          rows: 10,
          seats: 10,
          price: 12.5,
          taken: [],
        },
      ],
    });
    (filmsRepository.reservePlace as jest.Mock).mockResolvedValueOnce('5:8');

    const result = await service.createOrder(testOrderData);
    expect(filmsRepository.reservePlace).toHaveBeenCalledWith(
      'film-id-123',
      'session-id-456',
      '5:8'
    );

    expect(result).toEqual({
      total: 1,
      items: [
        {
          ...testOrderData.tickets[0],
          id: '5:8',
        },
      ],
    });
  });
});
