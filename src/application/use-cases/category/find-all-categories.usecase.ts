import { Injectable } from '@nestjs/common';
import { CategoryRepositoryPersistence } from 'src/infrastructure/persistence/prisma/category/category.repository.persistence';

export interface IFindAllCategoriesUseCase {
  limit: number;
  skip: number;
}

@Injectable()
export class FindAllCategoriesUseCase {
  constructor(
    private readonly categoryRepositoryPersistence: CategoryRepositoryPersistence,
  ) {}

  async execute({ limit, skip }: IFindAllCategoriesUseCase) {
    const { data, ...rest } = await this.categoryRepositoryPersistence.findAll(
      limit,
      skip,
    );

    return {
      ...rest,
      data: data.map((category) => ({
        id: category.id.toString(),
        name: category.name,
        description: category.description,
      })),
    };
  }
}
