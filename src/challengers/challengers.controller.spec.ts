import { Test, TestingModule } from '@nestjs/testing';
import { ChallengersController } from './challengers.controller';
import { ChallengersService } from './challengers.service';
import { MatchesService } from './matches.service';
import { ChallengeStatus } from './enum/challenge-status.enum';

describe('ChallengersController', () => {
  let controller: ChallengersController;
  let challengersService: ChallengersService;
  let matchesService: MatchesService;

  const mockChallenge = { _id: 'id', status: ChallengeStatus.PENDING };
  const mockMatch = { _id: 'match-id' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengersController],
      providers: [
        {
          provide: ChallengersService,
          useValue: {
            createChallenge: jest.fn().mockResolvedValue(mockChallenge),
            findAll: jest.fn().mockResolvedValue([mockChallenge]),
            findChallengesByPlayer: jest.fn().mockResolvedValue([mockChallenge]),
            findOne: jest.fn().mockResolvedValue(mockChallenge),
            update: jest.fn().mockResolvedValue(mockChallenge),
            delete: jest.fn().mockResolvedValue(mockChallenge),
          },
        },
        {
          provide: MatchesService,
          useValue: {
            createMatch: jest.fn().mockResolvedValue(mockMatch),
            findAll: jest.fn().mockResolvedValue([mockMatch]),
          },
        },
      ],
    }).compile();

    controller = module.get<ChallengersController>(ChallengersController);
    challengersService = module.get<ChallengersService>(ChallengersService);
    matchesService = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createChallenger', () => {
    it('should create a challenge', async () => {
      const dto = {} as any;
      const result = await controller.createChallenger(dto);
      expect(result).toEqual(mockChallenge);
      expect(challengersService.createChallenge).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all challenges if no playerId', async () => {
      const result = await controller.findAll(undefined);
      expect(result).toEqual([mockChallenge]);
      expect(challengersService.findAll).toHaveBeenCalled();
    });

    it('should return challenges for a player if playerId is provided', async () => {
      const result = await controller.findAll('player-id');
      expect(result).toEqual([mockChallenge]);
      expect(challengersService.findChallengesByPlayer).toHaveBeenCalledWith('player-id');
    });
  });

  describe('findOne', () => {
    it('should return a challenge by id', async () => {
      const result = await controller.findOne('id');
      expect(result).toEqual(mockChallenge);
      expect(challengersService.findOne).toHaveBeenCalledWith('id');
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const dto = { status: ChallengeStatus.ACCEPTED } as any;
      await controller.update('id', dto);
      expect(challengersService.update).toHaveBeenCalledWith('id', dto);
    });
  });

  describe('delete', () => {
    it('should delete a challenge', async () => {
      await controller.delete('id');
      expect(challengersService.delete).toHaveBeenCalledWith('id');
    });
  });

  describe('createMatch', () => {
    it('should create a match', async () => {
      const dto = {} as any;
      const result = await controller.createMatch('id', dto);
      expect(result).toEqual(mockMatch);
      expect(matchesService.createMatch).toHaveBeenCalledWith('id', dto);
    });
  });
});
