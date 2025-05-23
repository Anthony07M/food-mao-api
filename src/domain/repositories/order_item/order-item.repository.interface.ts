import { RepositoryInterface } from 'src/adapters/shared/repositories/repository.interface';
import {
  OrderItem,
  OrderItemId,
} from 'src/domain/entities/order_item/order-item.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrderItemRepositoryInterface
  extends RepositoryInterface<OrderItem, OrderItemId> {
  findByOrderId(orderId: string): Promise<OrderItem[]>;
}