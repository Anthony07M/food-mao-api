import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryId } from 'src/domain/entities/category.entity';
import { ProductId } from 'src/domain/entities/product.entity';
import { CategoryRepositoryPersistence } from 'src/infrastructure/persistence/prisma/category.repository.persistence';
import { ProductRepositoryPersistence } from 'src/infrastructure/persistence/prisma/product.repository.persistence';

export interface IUpdateProductUseCase {
  name?: string;
  categoryId?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPersistence,
    private readonly categoryRepository: CategoryRepositoryPersistence,
  ) {}

  async execute(productId: string, values: IUpdateProductUseCase) {
    const { name, price, description, imageUrl, categoryId } = values;

    const product = await this.productRepository.findById(
      new ProductId(productId),
    );

    if (!product) throw new NotFoundException('Product not found');

    let category = product.category;

    if (categoryId && values.categoryId !== category.id.toString()) {
      const foundCategory = await this.categoryRepository.findById(
        new CategoryId(values.categoryId),
      );

      if (!foundCategory) throw new NotFoundException('Category not found');

      category = foundCategory;
    }

    product.updateValues({
      name,
      price,
      description,
      imageUrl,
      category,
    });

    await this.productRepository.update(product);

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
