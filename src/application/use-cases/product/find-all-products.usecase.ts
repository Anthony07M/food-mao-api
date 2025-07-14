import { Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryPersistence } from 'src/infrastructure/persistence/prisma/product/product.repository.persistence';

export interface IFindAllProductsUseCase {
  limit: number;
  skip: number;
}

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryPersistence,
  ) {}

  async execute({ limit, skip }: IFindAllProductsUseCase) {
    const { data, ...rest } = await this.productRepository.findAll(limit, skip);

    return {
      ...rest,
      data: data.map((product) => ({
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
      })),
    };
  }
}
