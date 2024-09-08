import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/category.interface';
import { ParamsValidationPipe } from 'src/shared/pipes';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get('/:_id')
  async getCategoryById(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<Category> {
    return await this.categoriesService.findOne(_id);
  }

  @Delete('/:_id')
  async deleteCategoryById(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<number> {
    return await this.categoriesService.deleteCategory(_id);
  }

  @Patch('/:_id')
  async updateCategory(
    @Param('_id', ParamsValidationPipe) _id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<number> {
    return await this.categoriesService.updateCategory(_id, updateCategoryDto);
  }
}
