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
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/category.interface';
import { ParamsValidationPipe } from 'src/shared/pipes';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getCategories(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get('/:_id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryById(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<Category> {
    return await this.categoriesService.findOne(_id);
  }

  @Delete('/:_id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async deleteCategoryById(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<number> {
    return await this.categoriesService.deleteCategory(_id);
  }

  @Patch('/:_id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async updateCategory(
    @Param('_id', ParamsValidationPipe) _id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    await this.categoriesService.updateCategory(_id, updateCategoryDto);
  }

  @Post('/:category/players/:player')
  @ApiOperation({ summary: 'Assign a player to a category' })
  @ApiResponse({ status: 201, description: 'Player assigned' })
  @ApiResponse({ status: 404, description: 'Category or player not found' })
  async assignPlayerToCategory(@Param() params: string[]): Promise<void> {
    const _categoryId = params['category'];
    const _playerId = params['player'];

    await this.categoriesService.assignPlayerToCategory(_playerId, _categoryId);
  }
}
