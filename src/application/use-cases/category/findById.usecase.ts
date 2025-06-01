import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryId } from 'src/domain/entities/category.entity';
import { CategoryRepositoryPersistence } from 'src/infrastructure/persistence/prisma/category/category.repository.persistence';

@Injectable()
export class FindCategoryByIdUseCase {
  constructor(
    private readonly categoryRepositoryPersistence: CategoryRepositoryPersistence,
  ) {}

  async execute(categoryId: string) {
    const category = await this.categoryRepositoryPersistence.findById(
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
