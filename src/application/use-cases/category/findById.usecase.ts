import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryId } from 'src/domain/entities/category/category.entity';
import { CategoryRepositoryInterface } from 'src/domain/repositories/category.repository.interface';

@Injectable()
export class FindCategoryByIdUseCase {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(categoryId: string) {
    const category = await this.categoryRepository.findById(
      new CategoryId(categoryId),
    );

    if (!category) throw new NotFoundException('Category not found!');

    return {
      id: category.id.toString(),
      name: category.name,
      description: category.description,
    };
  }
}
