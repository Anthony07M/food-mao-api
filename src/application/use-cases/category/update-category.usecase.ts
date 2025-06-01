import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryId } from 'src/domain/entities/category.entity';
import { CategoryRepositoryPersistence } from 'src/infrastructure/persistence/prisma/category/category.repository.persistence';

export interface IUpdateCategoryUseCase {
  name?: string;
  description?: string;
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryRepositoryPersistence: CategoryRepositoryPersistence,
  ) {}

  async execute(categoryId: string, props: IUpdateCategoryUseCase) {
    const category = await this.categoryRepositoryPersistence.findById(
      new CategoryId(categoryId),
    );

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    category.updateValues(props);

    await this.categoryRepositoryPersistence.update(category);

    return {
      id: category.id.toString(),
      name: category.name,
      description: category.description,
    };
  }
}
