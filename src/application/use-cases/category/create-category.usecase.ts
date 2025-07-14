import { Inject, Injectable } from '@nestjs/common';
import { Category } from 'src/domain/entities/category/category.entity';
import { CategoryRepositoryInterface } from 'src/domain/repositories/category.repository.interface';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }
}