import { Injectable } from '@nestjs/common';
import { OrderItem } from 'src/domain/entities/order_item/order-item.entity';
import { OrderItemRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order_item/order-item.repository.persistence';

interface ICreateOrderItemUseCase {
  orderId: string;
  productId: string;
  quantity: number;
  notes?: string;
}

@Injectable()
export class CreateOrderItemUseCase {
  constructor(
    private readonly orderItemRepositoryPersistence: OrderItemRepositoryPersistence,
  ) {}

  async execute(params: ICreateOrderItemUseCase): Promise<OrderItem> {
    const orderItem = OrderItem.create({
      orderId: params.orderId,
      productId: params.productId,
      quantity: params.quantity,
      notes: params.notes,
    });

    await this.orderItemRepositoryPersistence.save(orderItem);
    return orderItem;
  }
}