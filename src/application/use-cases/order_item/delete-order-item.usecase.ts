import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemId } from 'src/domain/entities/order_item/order-item.entity';
import { OrderItemRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order_item/order-item.repository.persistence';

@Injectable()
export class DeleteOrderItemUseCase {
  constructor(
    @Inject('OrderItemRepositoryInterface')
    private readonly orderItemRepositoryPersistence: OrderItemRepositoryPersistence,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const orderItemId = new OrderItemId(id);
      const orderItem =
        await this.orderItemRepositoryPersistence.findById(orderItemId);

      if (!orderItem) {
        throw new NotFoundException(`OrderItem with ID ${id} not found`);
      }

      await this.orderItemRepositoryPersistence.remove(orderItemId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      throw new Error(`Failed to delete order item: ${errorMessage}`);
    }
  }
}