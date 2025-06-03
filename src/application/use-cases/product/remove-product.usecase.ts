import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductId } from 'src/domain/entities/product.entity';
import { ProductRepositoryPersistence } from 'src/infrastructure/persistence/prisma/product/product.repository.persistence';

@Injectable()
export class RemoveProductUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPersistence,
  ) {}

  async execute(productId: string) {
    const product = await this.productRepository.findById(
      new ProductId(productId),
    );

    if (!product) throw new NotFoundException('Product not found!');

    await this.productRepository.remove(product.id);

    return { message: 'Product removed!' };
  }
}
