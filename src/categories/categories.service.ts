import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CATEGORY_MODEL } from './categories.providers';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';

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
        `Player with cateogry ${category} already exists`,
      );
    }
    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }
}
