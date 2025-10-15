import { Test, TestingModule } from '@nestjs/testing';
import { IFilmsRepository } from '../films.repository';
import { PostgresFilmsRepository } from './postgres-films.repository';

describe('PostgresFilmsReporsitory', () => {
  let provider: IFilmsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresFilmsRepository],
    }).compile();

    provider = module.get<IFilmsRepository>(PostgresFilmsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
