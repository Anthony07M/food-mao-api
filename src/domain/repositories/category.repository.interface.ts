import { RepositoryInterface } from 'src/adapters/shared/repositories/repository.interface';
import { Category, CategoryId } from '../entities/category.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CategoryRepositoryInterface
  extends RepositoryInterface<Category, CategoryId> {}
