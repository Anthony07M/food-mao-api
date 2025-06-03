import { Injectable, NotFoundException } from '@nestjs/common';
import {
  OrderItem,
  OrderItemId,
} from 'src/domain/entities/order_item/order-item.entity';
import { OrderItemRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order_item/order-item.repository.persistence';

interface IUpdateOrderItemUseCaseParams {
  id: string;
  orderId?: string;
  productId?: string;
  quantity?: number;
  notes?: string;
}

@Injectable()
export class UpdateOrderItemUseCase {
  constructor(
    private readonly orderItemRepositoryPersistence: OrderItemRepositoryPersistence,
  ) {}

  async execute(params: IUpdateOrderItemUseCaseParams): Promise<OrderItem> {
    try {
      const orderItemId = new OrderItemId(params.id);
      const orderItem =
        await this.orderItemRepositoryPersistence.findById(orderItemId);

      if (!orderItem) {
        throw new NotFoundException(`OrderItem with ID ${params.id} not found`);
      }

      // Update only provided fields
      // if (params.orderId) orderItem.orderId = params.orderId;
      if (params.productId) orderItem.productId = params.productId;
      if (params.quantity) orderItem.quantity = params.quantity;
      if (params.notes !== undefined) orderItem.notes = params.notes;

      await this.orderItemRepositoryPersistence.update(orderItem);
      return orderItem;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      throw new Error(`Failed to update order item: ${errorMessage}`);
    }
  }
}
