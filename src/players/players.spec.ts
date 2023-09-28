import { Test, TestingModule } from '@nestjs/testing';
import { Players } from './players';

describe('Players', () => {
  let provider: Players;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Players],
    }).compile();

    provider = module.get<Players>(Players);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
