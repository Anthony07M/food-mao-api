import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderId } from 'src/domain/entities/order/order.entity';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';

@Injectable()
export class FindByIdOrderUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async execute(orderId: string) {
    const order = await this.orderRepositoryPersistence.findById(
      new OrderId(orderId),
    );

    if (!order) throw new NotFoundException('Order not found');

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
      client: order.client
        ? {
            id: order.client.id.toString(),
            name: order.client.name,
            email: order.client.email,
            cpf: order.client.cpf,
          }
        : null,
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
