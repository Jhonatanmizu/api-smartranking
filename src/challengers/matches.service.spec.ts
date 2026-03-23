import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { MATCH_MODEL } from './match.providers';
import { ChallengersService } from './challengers.service';
import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ChallengeStatus } from './enum/challenge-status.enum';

describe('MatchesService', () => {
  let service: MatchesService;
  let challengersService: ChallengersService;

  const mockPlayer = { _id: 'player-id' };
  const mockChallenge = {
    _id: 'challenge-id',
    players: [mockPlayer],
    category: 'Category A',
  };

  const mockMatch = {
    _id: 'match-id',
    save: jest.fn().mockResolvedValue({ _id: 'match-id' }),
  };

  type MockModel = {
    find: jest.Mock;
    new (): typeof mockMatch;
  } & jest.Mock;

  const mockMatchModel = jest.fn().mockImplementation(() => mockMatch) as unknown as MockModel;
  mockMatchModel.find = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: MATCH_MODEL,
          useValue: mockMatchModel,
        },
        {
          provide: ChallengersService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    challengersService = module.get<ChallengersService>(ChallengersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMatch', () => {
    const createDto = {
      def: { _id: 'player-id' } as any,
      result: [],
    };

    it('should throw NotFoundException if challenge not found', async () => {
      (challengersService.findOne as jest.Mock).mockResolvedValue(null);
      // Even if findOne throws, service handles it if it doesn't catch.
      // In matches.service.ts it doesn't catch, so it bubbles up.
      (challengersService.findOne as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(service.createMatch('id', createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if winner not in challenge', async () => {
      (challengersService.findOne as jest.Mock).mockResolvedValue(mockChallenge);
      const invalidDto = { ...createDto, def: { _id: 'other-id' } as any };

      await expect(service.createMatch('id', invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should create match and update challenge status', async () => {
      (challengersService.findOne as jest.Mock).mockResolvedValue(mockChallenge);
      (challengersService.update as jest.Mock).mockResolvedValue({});

      const result = await service.createMatch('id', createDto);

      expect(result).toBeDefined();
      expect(mockMatch.save).toHaveBeenCalled();
      expect(challengersService.update).toHaveBeenCalledWith('id', {
        status: ChallengeStatus.FINISHED,
        match: 'match-id',
      });
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      (challengersService.findOne as jest.Mock).mockResolvedValue(mockChallenge);
      mockMatch.save.mockRejectedValue(new Error('DB Error'));

      await expect(service.createMatch('id', createDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all matches', async () => {
      mockMatchModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMatch]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockMatch]);
    });
  });
});
