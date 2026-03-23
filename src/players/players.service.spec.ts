import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { PLAYER_MODEL } from './players.provider';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { CreatePlayerDto } from './dto/create-player.dto';

const mockPlayer = {
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  phoneNumber: 'any_phone',
  ranking: 'A',
  positionRanking: 1,
  urlPhotoPlayer: 'any_url',
};

const mockPlayerModel = {
  findOne: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

// To mock the constructor 'new this.playerModel(createPlayer)'
// we need to make the mockPlayerModel a function that returns an object with 'save' method
function MockPlayerModel(dto: any) {
  this.dto = dto;
  this.save = mockPlayerModel.save;
}
Object.assign(MockPlayerModel, mockPlayerModel);

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: PLAYER_MODEL,
          useValue: MockPlayerModel,
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a player successfully', async () => {
      const createPlayerDto: CreatePlayerDto = {
        name: 'any_name',
        email: 'any_email@mail.com',
        phoneNumber: 'any_phone',
      };
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      mockPlayerModel.save.mockResolvedValue(mockPlayer);

      const result = await service.create(createPlayerDto);

      expect(result).toEqual(mockPlayer);
      expect(mockPlayerModel.findOne).toHaveBeenCalledWith({
        email: createPlayerDto.email,
      });
      expect(mockPlayerModel.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if player already exists', async () => {
      const createPlayerDto: CreatePlayerDto = {
        name: 'any_name',
        email: 'any_email@mail.com',
        phoneNumber: 'any_phone',
      };
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPlayer),
      });

      await expect(service.create(createPlayerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a player successfully', async () => {
      const updatePlayerDto: UpdatePlayerDto = {
        name: 'updated_name',
        phoneNumber: 'updated_phone',
      };
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPlayer),
      });
      mockPlayerModel.findByIdAndUpdate.mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue({ ...mockPlayer, ...updatePlayerDto }),
      });

      const result = await service.update('any_id', updatePlayerDto);

      expect(result.name).toEqual('updated_name');
      expect(mockPlayerModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException if player to update does not exist', async () => {
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('any_id', {
          name: 'any_name',
          phoneNumber: 'any_phone',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllPlayers', () => {
    it('should return an array of players', async () => {
      mockPlayerModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockPlayer]),
      });

      const result = await service.findAllPlayers();

      expect(result).toEqual([mockPlayer]);
      expect(mockPlayerModel.find).toHaveBeenCalled();
    });

    it('should return an empty array, when no players are found', async () => {
      mockPlayerModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findAllPlayers();

      expect(result).toEqual([]);
      expect(mockPlayerModel.find).toHaveBeenCalled();
    });
  });

  describe('findOnePlayerByEmail', () => {
    it('should return a player if found by email', async () => {
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPlayer),
      });

      const result = await service.findOnePlayerByEmail('any_email@mail.com');

      expect(result).toEqual(mockPlayer);
    });

    it('should throw NotFoundException if player not found by email', async () => {
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findOnePlayerByEmail('any_email@mail.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOnePlayerById', () => {
    it('should return a player if found by id', async () => {
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPlayer),
      });

      const result = await service.findOnePlayerById('any_id');

      expect(result).toEqual(mockPlayer);
    });

    it('should throw NotFoundException if player not found by id', async () => {
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOnePlayerById('any_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deletePlayer', () => {
    it('should delete a player successfully', async () => {
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPlayer),
      });
      mockPlayerModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      const result = await service.deletePlayer('any_id');

      expect(result).toEqual(1);
      expect(mockPlayerModel.deleteOne).toHaveBeenCalledWith({ _id: 'any_id' });
    });

    it('should throw NotFoundException if player to delete does not exist', async () => {
      mockPlayerModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deletePlayer('any_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findManyPlayers', () => {
    it('should return many players', async () => {
      mockPlayerModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockPlayer]),
      });

      const result = await service.findManyPlayers(['any_id']);

      expect(result).toEqual([mockPlayer]);
      expect(mockPlayerModel.find).toHaveBeenCalledWith({
        _id: { $in: ['any_id'] },
      });
    });
  });
});
