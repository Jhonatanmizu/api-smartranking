import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './schema/category.schema';
import { PlayersService } from '../players/players.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
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
    playerId: string,
    categoryId: string,
  ): Promise<void> {
    const category = await this.categoryModel.findById(categoryId).exec();

    if (!category) {
      throw new BadRequestException(`Category ${categoryId} does not exist`);
    }

    const playerAlreadyInCategory = category.players.some(
      (id) => id.toString() === playerId,
    );

    if (playerAlreadyInCategory) {
      throw new BadRequestException(
        `Player ${playerId} is already in the Category ${categoryId}`,
      );
    }

    // validate player exists (throws if not found)
    await this.playerService.findOnePlayerById(playerId);

    await this.categoryModel
      .findByIdAndUpdate(categoryId, { $push: { players: playerId } })
      .exec();
  }
}
