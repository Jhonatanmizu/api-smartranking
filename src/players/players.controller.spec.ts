import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { CreatePlayerDto } from './dto/create-player.dto';

const mockPlayer = {
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  phoneNumber: 'any_phone',
};

const mockPlayersService = {
  findAllPlayers: jest.fn(),
  findOnePlayerById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  deletePlayer: jest.fn(),
};

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: mockPlayersService,
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlayers', () => {
    it('should return an array of players', async () => {
      mockPlayersService.findAllPlayers.mockResolvedValue([mockPlayer]);

      const result = await controller.getPlayers();

      expect(result).toEqual([mockPlayer]);
      expect(service.findAllPlayers).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPlayersByEmail', () => {
    it('should return a player by id', async () => {
      mockPlayersService.findOnePlayerById.mockResolvedValue(mockPlayer);

      const result = await controller.getPlayersByEmail('any_id');

      expect(result).toEqual(mockPlayer);
      expect(service.findOnePlayerById).toHaveBeenCalledWith('any_id');
    });
  });

  describe('createOrUpdatePlayer', () => {
    it('should create a player', async () => {
      const createPlayerDto: CreatePlayerDto = {
        name: 'any_name',
        email: 'any_email@mail.com',
        phoneNumber: 'any_phone',
      };
      mockPlayersService.create.mockResolvedValue(mockPlayer);

      await controller.createOrUpdatePlayer(createPlayerDto);

      expect(service.create).toHaveBeenCalledWith(createPlayerDto);
    });
  });

  describe('updatePlayer', () => {
    it('should update a player', async () => {
      const updatePlayerDto: UpdatePlayerDto = {
        name: 'updated_name',
        phoneNumber: 'updated_phone',
      };
      mockPlayersService.update.mockResolvedValue(mockPlayer);

      await controller.updatePlayer('any_id', updatePlayerDto);

      expect(service.update).toHaveBeenCalledWith('any_id', updatePlayerDto);
    });
  });

  describe('deletePlayer', () => {
    it('should delete a player', async () => {
      mockPlayersService.deletePlayer.mockResolvedValue(1);

      await controller.deletePlayer('any_id');

      expect(service.deletePlayer).toHaveBeenCalledWith('any_id');
    });
  });
});
