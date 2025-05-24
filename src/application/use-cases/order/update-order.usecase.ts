/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Order,
  OrderId,
  StatusOrder,
  StatusPayment,
} from 'src/domain/entities/order/order.entity';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';

interface IUpdateOrderUseCaseParams {
  id: string;
  status?: StatusOrder;
  paymentStatus?: StatusPayment;
}

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async execute(params: IUpdateOrderUseCaseParams) {
    const order = await this.orderRepositoryPersistence.findById(
      new OrderId(params.id),
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update only provided fields
    if (params.status) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      order.status = params.status;
    }
    if (params.paymentStatus) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      order.paymentStatus = params.paymentStatus;
    }

    if (params.status === 'In_Progress' && !order.preparationStarted) {
      order.preparationStarted = new Date();
    }
    if (params.status === 'Started' && !order.readyAt) {
      order.readyAt = new Date();
    }
    if (params.status === 'Concluded' && !order.completedAt) {
      order.completedAt = new Date();
    }

    await this.orderRepositoryPersistence.update(order);

    return {
      id: order.id.toString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      orderCode: order.orderCode,
      client: order.client,
      status: order.status,
      total: order.calculateTotal(),
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      preparationStarted: order.preparationStarted,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
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