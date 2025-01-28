import { Test, TestingModule } from '@nestjs/testing';
import { ChallengersService } from './challengers.service';

describe('ChallengersService', () => {
  let service: ChallengersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallengersService],
    }).compile();

    service = module.get<ChallengersService>(ChallengersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
