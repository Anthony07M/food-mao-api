import { RepositoryInterface } from 'src/adapters/shared/repositories/repository.interface';
import { Product, ProductId } from '../entities/product.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProductRepositoryInterface
  extends RepositoryInterface<Product, ProductId> {}
