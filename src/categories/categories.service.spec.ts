import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CATEGORY_MODEL } from './categories.providers';
import { PlayersService } from '../players/players.service';
import { Category } from './interfaces/category.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let playersService: PlayersService;

  const mockCategory = {
    _id: 'category-id',
    name: 'Category A',
    description: 'Description A',
    events: [{ name: 'Event 1', operation: '+', value: 10 }],
    players: [],
    save: jest.fn().mockResolvedValue({
      _id: 'category-id',
      name: 'Category A',
      description: 'Description A',
      events: [{ name: 'Event 1', operation: '+', value: 10 }],
      players: [],
    }),
  };

  // Define a type for our mock model to avoid 'any' and satisfy TS
  type MockModel = {
    findOne: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    deleteOne: jest.Mock;
    new (): typeof mockCategory;
  } & jest.Mock;

  const mockCategoryModel = jest.fn().mockImplementation(() => mockCategory) as unknown as MockModel;

  mockCategoryModel.findOne = jest.fn();
  mockCategoryModel.find = jest.fn();
  mockCategoryModel.findById = jest.fn();
  mockCategoryModel.findByIdAndUpdate = jest.fn();
  mockCategoryModel.deleteOne = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CATEGORY_MODEL,
          useValue: mockCategoryModel,
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
    playersService = module.get<PlayersService>(PlayersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should throw BadRequestException if category already exists', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Category A',
        description: 'Desc',
        events: [],
      };

      mockCategoryModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      await expect(service.createCategory(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a category successfully', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Category B',
        description: 'Desc B',
        events: [],
      };

      mockCategoryModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.createCategory(createDto);

      expect(result).toBeDefined();
      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
        name: 'Category B',
      });
      expect(mockCategory.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockCategoryModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockCategory]),
      });

      const result = await service.findAll();

      expect(result).toEqual([mockCategory]);
      expect(mockCategoryModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if category is not found', async () => {
      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a category if found', async () => {
      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await service.findOne('category-id');

      expect(result).toEqual(mockCategory);
      expect(mockCategoryModel.findById).toHaveBeenCalledWith('category-id');
    });
  });

  describe('updateCategory', () => {
    it('should throw NotFoundException if category is not found for update', async () => {
      const updateDto: UpdateCategoryDto = {
        description: 'Updated',
        events: [],
      };

      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateCategory('invalid-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update a category successfully', async () => {
      const updateDto: UpdateCategoryDto = {
        description: 'Updated',
        events: [],
      };

      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      mockCategoryModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      await service.updateCategory('category-id', updateDto);

      expect(mockCategoryModel.findById).toHaveBeenCalledWith('category-id');
      expect(mockCategoryModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category and return deletedCount', async () => {
      mockCategoryModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      const result = await service.deleteCategory('category-id');

      expect(result).toBe(1);
      expect(mockCategoryModel.deleteOne).toHaveBeenCalledWith({
        _id: 'category-id',
      });
    });
  });

  describe('assignPlayerToCategory', () => {
    it('should throw NotFoundException if category not found', async () => {
      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      (playersService.findOnePlayerById as jest.Mock).mockResolvedValue({
        _id: 'player-id',
      });

      await expect(
        service.assignPlayerToCategory('player-id', 'category-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if player is already assigned', async () => {
      const categoryWithPlayer = {
        ...mockCategory,
        players: ['player-id'],
      };

      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(categoryWithPlayer),
      });

      (playersService.findOnePlayerById as jest.Mock).mockResolvedValue({
        _id: 'player-id',
      });

      await expect(
        service.assignPlayerToCategory('player-id', 'category-id'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should assign player to category successfully', async () => {
      const categoryWithNoPlayers = {
        ...mockCategory,
        players: [],
      };

      mockCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(categoryWithNoPlayers),
      });

      (playersService.findOnePlayerById as jest.Mock).mockResolvedValue({
        _id: 'player-id',
      });

      mockCategoryModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await service.assignPlayerToCategory('player-id', 'category-id');

      expect(mockCategoryModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('playerCategory', () => {
    it('should return category where player is present', async () => {
      const playerId = 'player-id';

      mockCategoryModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await service.playerCategory(playerId);

      expect(result).toEqual(mockCategory);
      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
        players: { $in: [playerId] },
      });
    });
  });
});
