import { Test, TestingModule } from '@nestjs/testing';
import { IFilmsRepository } from '../films.repository';
import { MongoFilmsRepository } from './mongo-films.repository';

describe('FilmsRepository', () => {
  let provider: IFilmsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoFilmsRepository],
    }).compile();

    provider = module.get<IFilmsRepository>(MongoFilmsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
