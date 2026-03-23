import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory = {
    _id: 'category-id',
    name: 'Category A',
    description: 'Description A',
    events: [],
    players: [],
  } as unknown as Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            createCategory: jest.fn().mockResolvedValue(mockCategory),
            findAll: jest.fn().mockResolvedValue([mockCategory]),
            findOne: jest.fn().mockResolvedValue(mockCategory),
            deleteCategory: jest.fn().mockResolvedValue(1),
            updateCategory: jest.fn().mockResolvedValue(undefined),
            assignPlayerToCategory: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const dto: CreateCategoryDto = {
        name: 'Category A',
        description: 'Desc',
        events: [],
      };
      const result = await controller.createCategory(dto);
      expect(result).toEqual(mockCategory);
      expect(service.createCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const result = await controller.getCategories();
      expect(result).toEqual([mockCategory]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const result = await controller.getCategoryById('category-id');
      expect(result).toEqual(mockCategory);
      expect(service.findOne).toHaveBeenCalledWith('category-id');
    });
  });

  describe('deleteCategoryById', () => {
    it('should delete a category and return count', async () => {
      const result = await controller.deleteCategoryById('category-id');
      expect(result).toBe(1);
      expect(service.deleteCategory).toHaveBeenCalledWith('category-id');
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const dto: UpdateCategoryDto = {
        description: 'Updated',
        events: [],
      };
      await controller.updateCategory('category-id', dto);
      expect(service.updateCategory).toHaveBeenCalledWith('category-id', dto);
    });
  });

  describe('assignPlayerToCategory', () => {
    it('should assign a player to a category', async () => {
      const params = { category: 'cat-id', player: 'player-id' };
      // Note: we cast because controller expects string[] but uses it as record
      await controller.assignPlayerToCategory(params as unknown as string[]);
      expect(service.assignPlayerToCategory).toHaveBeenCalledWith(
        'player-id',
        'cat-id',
      );
    });
  });
});
