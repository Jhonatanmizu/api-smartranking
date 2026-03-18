import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CATEGORY_MODEL } from './categories.providers';
import { PlayersService } from '../players/players.service';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let model: jest.Mocked<Model<Category>>;

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

  describe('playerCategory', () => {
    it('should return category where player is present', async () => {
      const playerId = 'player-id';
      const category = { name: 'Category 1' };

      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(category),
      });

      const result = await service.playerCategory(playerId);

      expect(result).toEqual(category);
      expect(model.findOne).toHaveBeenCalledWith({ players: { $in: [playerId] } });
    });
  });
});
