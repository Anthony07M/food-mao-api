// update-category.usecase.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryId } from 'src/domain/entities/category/category.entity';
import { CategoryRepositoryInterface } from 'src/domain/repositories/category.repository.interface';

export interface IUpdateCategoryUseCase {
  name?: string;
  description?: string;
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(categoryId: string, props: IUpdateCategoryUseCase) {
    const category = await this.categoryRepository.findById(
      new CategoryId(categoryId),
    );

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    category.updateValues(props);

    const updatedCategory = await this.categoryRepository.update(category);

    return {
      id: updatedCategory.id.toString(),
      name: updatedCategory.name,
      description: updatedCategory.description,
    };
  }
}