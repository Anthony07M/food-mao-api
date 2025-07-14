import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductUseCase } from 'src/application/use-cases/product/create-product.usecase';
import { FindAllProductsUseCase } from 'src/application/use-cases/product/find-all-products.usecase';
import { FindProductByIdUseCase } from 'src/application/use-cases/product/findById.usecase';
import { RemoveProductUseCase } from 'src/application/use-cases/product/remove-product.usecase';
import { UpdateProductUseCase } from 'src/application/use-cases/product/update-product.usecase';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/domain/entities/product/product.entity';
import { Category } from 'src/domain/entities/category/category.entity';
import { FindCategoryByIdUseCase } from 'src/application/use-cases/category/findById.usecase';

@Controller('product')
export class ProductController {
  @Inject(CreateProductUseCase)
  private readonly createProductUseCase: CreateProductUseCase;

  @Inject(FindProductByIdUseCase)
  private readonly findProductByIdUseCase: FindProductByIdUseCase;

  @Inject(UpdateProductUseCase)
  private readonly updateProductUseCase: UpdateProductUseCase;

  @Inject(RemoveProductUseCase)
  private readonly removeProductUseCase: RemoveProductUseCase;

  @Inject(FindAllProductsUseCase)
  private readonly findAllProductsUseCase: FindAllProductsUseCase;

  @Inject(FindCategoryByIdUseCase)
  private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase;

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    const categoryData = await this.findCategoryByIdUseCase.execute(
      createProductDto.categoryId,
    );
    if (!categoryData) {
      throw new NotFoundException('Category not found.');
    }
    const category = Category.create(categoryData);

    try {
      const product = Product.create({ ...createProductDto, category });
      return await this.createProductUseCase.execute(product);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/:productId')
  async update(
    @Param('productId', new ParseUUIDPipe()) categoryId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.updateProductUseCase.execute(
      categoryId,
      updateProductDto,
    );
  }

  @Get()
  async findAll(
    @Query('limit', ParseIntPipe) limit: number = 100,
    @Query('skip', ParseIntPipe) skip: number = 0,
  ) {
    return await this.findAllProductsUseCase.execute({ limit, skip });
  }

  @Get('/:productId')
  async findById(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return await this.findProductByIdUseCase.execute(productId);
  }

  @Delete('/:productId')
  async remove(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return await this.removeProductUseCase.execute(productId);
  }
}
