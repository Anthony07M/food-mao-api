import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderId } from 'src/domain/entities/order/order.entity';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepositoryPersistence.findById(
      new OrderId(orderId),
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderRepositoryPersistence.remove(new OrderId(orderId));
  }
}