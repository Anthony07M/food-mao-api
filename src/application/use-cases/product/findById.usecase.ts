import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductId } from 'src/domain/entities/product.entity';
import { ProductRepositoryPersistence } from 'src/infrastructure/persistence/prisma/product/product.repository.persistence';

@Injectable()
export class FindProductByIdUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPersistence,
  ) {}

  async execute(productId: string) {
    const product = await this.productRepository.findById(
      new ProductId(productId),
    );

    if (!product) throw new NotFoundException('Product not found!');

    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: {
        id: product.category.id.toString(),
        name: product.category.name,
        description: product.category.description,
      },
    };
  }
}
