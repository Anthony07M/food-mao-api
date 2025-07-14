import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderId, StatusOrder } from 'src/domain/entities/order/order.entity';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';

interface IUpdateOrderUseCaseParams {
  id: string;
  status?: StatusOrder;
}

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async execute({ id, status }: IUpdateOrderUseCaseParams) {
    const order = await this.orderRepositoryPersistence.findById(
      new OrderId(id),
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (status === 'Received') {
      order.receivedOrder();
    }

    if (status === 'In_Progress') {
      order.initPreparation();
    }

    if (status === 'Ready') {
      order.finalizyPreparation();
    }

    if (status === 'Concluded') {
      order.concludedOrder();
    }

    await this.orderRepositoryPersistence.update(order);

    return {
      id: order.id.toString(),
      orderCode: order.orderCode,
      status: order.status,
      total: order.calculateTotal(),
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      preparationStarted: order.preparationStarted,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
      client: order.client,
      items: order.items.map((item) => {
        return {
          id: item.id.toString(),
          quantity: item.quantity,
          notes: item.notes,
          product: {
            id: item.product.id.toString(),
            name: item.product.name,
            price: item.product.price,
            description: item.product.description,
            imageUrl: item.product.imageUrl,
            category: {
              id: item.product.category.id.toString(),
              name: item.product.category.name,
              description: item.product.category.description,
            },
          },
        };
      }),
    };
  }
}
