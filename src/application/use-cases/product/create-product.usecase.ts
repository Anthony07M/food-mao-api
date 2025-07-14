import { Inject, Injectable } from '@nestjs/common';
import { Product } from 'src/domain/entities/product/product.entity';
import { ProductRepositoryInterface } from 'src/domain/repositories/product.repository.interface';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface) {}

  async execute(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }
}
