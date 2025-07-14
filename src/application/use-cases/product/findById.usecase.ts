import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductId } from 'src/domain/entities/product/product.entity';
import { ProductRepositoryPersistence } from 'src/infrastructure/persistence/prisma/product/product.repository.persistence';

@Injectable()
export class FindProductByIdUseCase {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryPersistence,
  ) {}

  async execute(productId: string) {
    const product = await this.productRepository.findById(
      new ProductId(productId),
    );

    if (!product) throw new NotFoundException('Product not found!');

    return product;
  }
}
