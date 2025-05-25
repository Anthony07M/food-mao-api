/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';

@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async execute(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    const result = await this.orderRepositoryPersistence.findAll(limit, skip);

    return {
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      data: result.data.map((order) => ({
        id: order.id.toString(),
        orderCode: order.orderCode,
        client: order.client
          ? {
              id: order.client.id.toString(),
              name: order.client.name,
              email: order.client.email,
              cpf: order.client.cpf,
            }
          : null,
        status: order.status,
        total: order.calculateTotal(),
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        preparationStarted: order.preparationStarted,
        readyAt: order.readyAt,
        completedAt: order.completedAt,
        items: order.items.map((item) => ({
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
        })),
      })),
    };
  }
}
