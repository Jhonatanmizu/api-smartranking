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

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_MODEL)
    private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;
    const exists = await this.categoryModel.findOne({ category }).exec();

    if (exists) {
      throw new BadRequestException(
        `Player with category ${category} already exists`,
      );
    }
    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().exec();
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

    await this.categoryModel.findOneAndUpdate({ _id }, updateCategory).exec();
  }
}
