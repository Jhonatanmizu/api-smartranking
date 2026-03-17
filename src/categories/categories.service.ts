import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CATEGORY_MODEL } from './categories.providers';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';
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

    const exists = await this.categoryModel.findOne({ name }).lean().exec();
    if (exists) {
      throw new BadRequestException(`Category "${name}" already exists`);
    }

    return new this.categoryModel(createCategoryDto).save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().populate('players').exec();
  }

  async findOne(_id: string): Promise<Category> {
    const category = await this.categoryModel.findById(_id).exec();
    if (!category) {
      throw new NotFoundException(`Category with id "${_id}" not found`);
    }
    return category;
  }

  async updateCategory(
    _id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const category = await this.categoryModel.findById(_id).exec();

    if (!category) {
      throw new NotFoundException(`Category with id "${_id}" not found`);
    }

    await this.categoryModel
      .findByIdAndUpdate(_id, { $set: updateCategoryDto })
      .exec();
  }

  async deleteCategory(_id: string): Promise<number> {
    const result = await this.categoryModel.deleteOne({ _id }).exec();
    return result.deletedCount;
  }

  async assignPlayerToCategory(
    playerId: string,
    categoryId: string,
  ): Promise<void> {
    const [category, player] = await Promise.all([
      this.categoryModel.findById(categoryId).exec(),
      this.playerService.findOnePlayerById(playerId),
    ]);

    if (!category) {
      throw new NotFoundException(`Category with id "${categoryId}" not found`);
    }

    const alreadyAssigned = category.players.some(
      (p) => p.toString() === playerId,
    );
    if (alreadyAssigned) {
      throw new BadRequestException(
        `Player "${playerId}" is already assigned to category "${categoryId}"`,
      );
    }

    category.players.push(player);
    await this.categoryModel
      .findByIdAndUpdate(categoryId, { $set: { players: category.players } })
      .exec();
  }
}
