import { Injectable, NotFoundException } from '@nestjs/common';
import {
  OrderItem,
  OrderItemId,
} from 'src/domain/entities/order_item/order-item.entity';
import { OrderItemRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order_item/order-item.repository.persistence';

@Injectable()
export class GetOrderItemByIdUseCase {
  constructor(
    private readonly orderItemRepositoryPersistence: OrderItemRepositoryPersistence,
  ) {}

  async execute(id: string): Promise<OrderItem> {
    try {
      const orderItemId = new OrderItemId(id);
      const orderItem =
        await this.orderItemRepositoryPersistence.findById(orderItemId);

      if (!orderItem) {
        throw new NotFoundException(`OrderItem with ID ${id} not found`);
      }

      return orderItem;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      throw new Error(`Failed to get order item: ${errorMessage}`);
    }
  }
}