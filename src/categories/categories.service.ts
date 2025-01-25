import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CATEGORY_MODEL } from './categories.providers';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_MODEL)
    private readonly categoryModel: Model<Category>,
    private readonly playerService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name } = createCategoryDto;
    const exists = await this.categoryModel.findOne({ name }).exec();

    if (exists) {
      throw new BadRequestException(`Category with ${name} already exists`);
    }
    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel
      .find()
      .populate('players')
      .exec();
    return categories;
  }

  async findOne(_id: string): Promise<Category | null> {
    const exists = await this.categoryModel
      .findOne({
        _id,
      })
      .exec();

    if (!exists) {
      throw new NotFoundException(`
        Category with _id:${_id} not found
        `);
    }

    return exists;
  }

  async deleteCategory(_id: string): Promise<number> {
    const result = await this.categoryModel
      .deleteOne({
        _id,
      })
      .exec();
    return result.deletedCount;
  }

  async updateCategory(
    _id: string,
    updateCategory: UpdateCategoryDto,
  ): Promise<void> {
    const exists = await this.categoryModel
      .findOne({
        _id,
      })
      .exec();

    if (!exists) {
      throw new NotFoundException(`
          Category with _id:${_id} not found
          `);
    }

    await this.categoryModel
      .findOneAndUpdate({ _id }, { $set: updateCategory })
      .exec();
  }

  async assignPlayerToCategory(
    _playerId: string,
    _categoryId: string,
  ): Promise<void> {
    const resultCategory = await this.categoryModel
      .findOne({ _id: _categoryId })
      .exec();

    const playersInCategory = await this.categoryModel
      .find({ _id: _categoryId })
      .where('players')
      .in([_playerId])
      .exec();
    const playerIsAlreadyInCategory = playersInCategory.length > 0;

    if (playerIsAlreadyInCategory) {
      throw new BadRequestException(
        `Player ${_categoryId} is already in the Category ${_categoryId}`,
      );
    }

    await this.playerService.findOnePlayerById(_playerId);

    if (!resultCategory) {
      throw new BadRequestException(`Category ${_categoryId} does not exists`);
    }

    resultCategory.players.push(_playerId);

    this.categoryModel
      .findOneAndUpdate({ _id: _categoryId }, resultCategory)
      .exec();
  }
}
