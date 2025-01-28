import { Test, TestingModule } from '@nestjs/testing';
import { ChallengersController } from './challengers.controller';

describe('ChallengersController', () => {
  let controller: ChallengersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengersController],
    }).compile();

    controller = module.get<ChallengersController>(ChallengersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
