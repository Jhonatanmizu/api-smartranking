import { Test, TestingModule } from '@nestjs/testing';
import { ChallengersService } from './challengers.service';
import { CHALLENGER_MODEL } from './challengers.providers';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ChallengeStatus } from './enum/challenge-status.enum';

describe('ChallengersService', () => {
  let service: ChallengersService;
  let playersService: PlayersService;
  let categoriesService: CategoriesService;

  const mockPlayer = {
    _id: 'player-id',
    name: 'Player Name',
    email: 'player@email.com',
  };

  const mockCategory = {
    _id: 'category-id',
    name: 'Category A',
  };

  const mockChallenge = {
    _id: 'challenge-id',
    status: ChallengeStatus.PENDING,
    requester: mockPlayer,
    players: [mockPlayer],
    save: jest.fn().mockResolvedValue({
      _id: 'challenge-id',
      status: ChallengeStatus.PENDING,
      requester: mockPlayer,
      players: [mockPlayer],
    }),
  };

  type MockModel = {
    find: jest.Mock;
    findOne: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
    new (): typeof mockChallenge;
  } & jest.Mock;

  const mockChallengerModel = jest.fn().mockImplementation(() => mockChallenge) as unknown as MockModel;

  mockChallengerModel.find = jest.fn();
  mockChallengerModel.findOne = jest.fn();
  mockChallengerModel.findById = jest.fn();
  mockChallengerModel.findByIdAndUpdate = jest.fn();
  mockChallengerModel.findByIdAndDelete = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengersService,
        {
          provide: CHALLENGER_MODEL,
          useValue: mockChallengerModel,
        },
        {
          provide: PlayersService,
          useValue: {
            findOnePlayerById: jest.fn(),
            findManyPlayers: jest.fn(),
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            playerCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChallengersService>(ChallengersService);
    playersService = module.get<PlayersService>(PlayersService);
    categoriesService = module.get<CategoriesService>(CategoriesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createChallenge', () => {
    const createDto = {
      challengeDate: new Date(),
      requester: { _id: 'player-id' } as any,
      players: [{ _id: 'player-id' }] as any[],
    };

    it('should throw NotFoundException if requester not found', async () => {
      (playersService.findOnePlayerById as jest.Mock).mockResolvedValue(null);

      await expect(service.createChallenge(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if some players not found', async () => {
      (playersService.findOnePlayerById as jest.Mock).mockResolvedValue(mockPlayer);
      (playersService.findManyPlayers as jest.Mock).mockResolvedValue([]);

      await expect(service.createChallenge(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if requester not in players', async () => {
      const invalidDto = {
        ...createDto,
        requester: { _id: 'other-id' } as any,
      };
      (playersService.findOnePlayerById as jest.Mock).mockResolvedValue({ _id: 'other-id' });
      (playersService.findManyPlayers as jest.Mock).mockResolvedValue([{ _id: 'player-id' }, { _id: 'other-id' }]);

      await expect(service.createChallenge(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if requester not in a category', async () => {
      (playersService.findOnePlayerById as jest.Mock).mockResolvedValue(mockPlayer);
      (playersService.findManyPlayers as jest.Mock).mockResolvedValue([mockPlayer]);
      (categoriesService.playerCategory as jest.Mock).mockResolvedValue(null);

      await expect(service.createChallenge(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should create a challenge successfully', async () => {
      (playersService.findOnePlayerById as jest.Mock).mockResolvedValue(mockPlayer);
      (playersService.findManyPlayers as jest.Mock).mockResolvedValue([mockPlayer]);
      (categoriesService.playerCategory as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.createChallenge(createDto);

      expect(result).toBeDefined();
      expect(mockChallenge.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all challenges', async () => {
      mockChallengerModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockChallenge]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockChallenge]);
    });
  });

  describe('findChallengesByPlayer', () => {
    it('should return challenges for a player', async () => {
      mockChallengerModel.find.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockChallenge]),
      });

      const result = await service.findChallengesByPlayer('player-id');
      expect(result).toEqual([mockChallenge]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if challenge not found', async () => {
      mockChallengerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });

    it('should return a challenge if found', async () => {
      mockChallengerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChallenge),
      });

      const result = await service.findOne('id');
      expect(result).toEqual(mockChallenge);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if challenge not found', async () => {
      mockChallengerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('id', {})).rejects.toThrow(NotFoundException);
    });

    it('should update challenge and set answeredAt if status is provided', async () => {
      mockChallengerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChallenge),
      });
      mockChallengerModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockChallenge, status: ChallengeStatus.ACCEPTED }),
      });

      const result = await service.update('id', { status: ChallengeStatus.ACCEPTED });
      expect(result.status).toBe(ChallengeStatus.ACCEPTED);
      expect(mockChallengerModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if challenge not found', async () => {
      mockChallengerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete('id')).rejects.toThrow(NotFoundException);
    });

    it('should delete challenge if found', async () => {
      mockChallengerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChallenge),
      });
      mockChallengerModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockChallenge),
      });

      await service.delete('id');
      expect(mockChallengerModel.findByIdAndDelete).toHaveBeenCalledWith('id');
    });
  });
});
