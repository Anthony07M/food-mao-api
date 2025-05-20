import { Injectable } from '@nestjs/common';
import { Category } from 'src/domain/entities/category.entity';
import { CategoryRepositoryPersistence } from 'src/infrastructure/persistence/prisma/category.repository.persistence';

export interface ICreateCategoryUseCase {
  name: string;
  description: string;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepositoryPersistence: CategoryRepositoryPersistence,
  ) {}

  async execute(props: ICreateCategoryUseCase) {
    const category = Category.create(props);

    await this.categoryRepositoryPersistence.save(category);

    return category;
  }
}
