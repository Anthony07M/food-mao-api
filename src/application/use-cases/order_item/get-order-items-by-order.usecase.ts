import { Inject, Injectable } from '@nestjs/common';
import { OrderItem } from 'src/domain/entities/order_item/order-item.entity';
import { OrderItemRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order_item/order-item.repository.persistence';

@Injectable()
export class GetOrderItemsByOrderUseCase {
  constructor(
    @Inject('OrderItemRepositoryInterface')
    private readonly orderItemRepositoryPersistence: OrderItemRepositoryPersistence,
  ) {}

  async execute(orderId: string): Promise<OrderItem[]> {
    return this.orderItemRepositoryPersistence.findByOrderId(orderId);
  }
}