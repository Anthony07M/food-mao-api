import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryId } from 'src/domain/entities/category.entity';
import { Product } from 'src/domain/entities/product.entity';
import { CategoryRepositoryPersistence } from 'src/infrastructure/persistence/prisma/category.repository.persistence';
import { ProductRepositoryPersistence } from 'src/infrastructure/persistence/prisma/product.repository.persistence';

export interface ICreateProductUseCase {
  name: string;
  categoryId: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPersistence,
    private readonly categoryRepository: CategoryRepositoryPersistence,
  ) {}

  async execute({
    name,
    price,
    description,
    imageUrl,
    categoryId,
  }: ICreateProductUseCase) {
    const category = await this.categoryRepository.findById(
      new CategoryId(categoryId),
    );

    if (!category) throw new NotFoundException('Category not found');

    const product = Product.create({
      name,
      price,
      description,
      imageUrl,
      category,
    });

    await this.productRepository.save(product);

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
