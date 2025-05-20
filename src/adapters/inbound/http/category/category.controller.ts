import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCategoryUseCase } from 'src/application/use-cases/category/create-category.usecase';
import { FindAllCategoriesUseCase } from 'src/application/use-cases/category/find-all-categories.usecase';
import { UpdateCategoryUseCase } from 'src/application/use-cases/category/update-category.usecase';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { FindCategoryByIdUseCase } from 'src/application/use-cases/category/findById.usecase';

@Controller('category')
export class CategoryController {
  @Inject(CreateCategoryUseCase)
  private readonly createCategoryUseCase: CreateCategoryUseCase;

  @Inject(FindAllCategoriesUseCase)
  private readonly findAllCategoriesUseCase: FindAllCategoriesUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateCategoryUseCase: UpdateCategoryUseCase;

  @Inject(FindCategoryByIdUseCase)
  private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.createCategoryUseCase.execute(createCategoryDto);
  }

  @Patch('/:categoryId')
  async update(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.updateCategoryUseCase.execute(
      categoryId,
      updateCategoryDto,
    );
  }

  @Get()
  async findAll(
    @Query('limit', ParseIntPipe) limit: number = 100,
    @Query('skip', ParseIntPipe) skip: number = 0,
  ) {
    return await this.findAllCategoriesUseCase.execute({ limit, skip });
  }

  @Get('/:categoryId')
  async findById(@Param('categoryId', new ParseUUIDPipe()) categoryId: string) {
    return await this.findCategoryByIdUseCase.execute(categoryId);
  }
}
