import { RepositoryInterface } from 'src/adapters/shared/repositories/repository.interface';
import { Order, OrderId } from '../../entities/order/order.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrderRepositoryInterface
  extends RepositoryInterface<Order, OrderId> {}
