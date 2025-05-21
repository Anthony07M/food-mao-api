import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.createProductUseCase.execute(createProductDto);
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
