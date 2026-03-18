import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CATEGORY_MODEL } from './categories.providers';
import { PlayersService } from '../players/players.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CATEGORY_MODEL,
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: PlayersService,
          useValue: {
            findOnePlayerById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    model = module.get(CATEGORY_MODEL);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkPlayerInCategory', () => {
    it('should return true if player is in category', async () => {
      const playerId = 'player-id';
      const categoryId = 'category-id';

      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: categoryId }),
      });

      const result = await service.checkPlayerInCategory(playerId, categoryId);

      expect(result).toBe(true);
      expect(model.findOne).toHaveBeenCalledWith({
        _id: categoryId,
        players: playerId,
      });
    });

    it('should return false if player is not in category', async () => {
      const playerId = 'player-id';
      const categoryId = 'category-id';

      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.checkPlayerInCategory(playerId, categoryId);

      expect(result).toBe(false);
    });
  });

  describe('playerCategory', () => {
    it('should return categories where player is present', async () => {
      const playerId = 'player-id';
      const categories = [{ name: 'Category 1' }];

      model.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(categories),
      });

      const result = await service.playerCategory(playerId);

      expect(result).toEqual(categories);
      expect(model.find).toHaveBeenCalledWith({ players: playerId });
    });
  });
});
