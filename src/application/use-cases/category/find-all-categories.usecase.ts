import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepositoryInterface } from 'src/domain/repositories/category.repository.interface';

export interface IFindAllCategoriesUseCase {
  limit: number;
  skip: number;
}

@Injectable()
export class FindAllCategoriesUseCase {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute({ limit, skip }: IFindAllCategoriesUseCase) {
    const { data, ...rest } = await this.categoryRepository.findAll(
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
