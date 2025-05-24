import { Injectable } from '@nestjs/common';
import { Client, ClientId } from 'src/domain/entities/client/client.entity';
import {
  Order,
  OrderId,
  StatusOrder,
  StatusPayment,
} from 'src/domain/entities/order/order.entity';
import { OrderRepositoryInterface } from 'src/domain/repositories/order/order.repository.interface';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';

@Injectable()
export class OrderRepositoryPersistence implements OrderRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async save(order: Order): Promise<void> {
    await this.prismaService.order.create({
      data: {
        id: order.id.toString(),
        order_code: order.orderCode,
        status: order.status,
        total: order.calculateTotal(),
        payment_status: order.paymentStatus,
        created_at: order.createdAt,
        client_id: order.client?.id.toString(),
        completed_at: order.completedAt,
        ready_at: order.readyAt,
        preparation_started: order.preparationStarted,
        items: {
          createMany: {
            data: order.items.map((item) => ({
              id: item.id.toString(),
              product_id: item.product.id.toString(),
              quantity: item.quantity,
              notes: item.notes,
            })),
          },
        },
      },
    });
  }

  async remove(orderId: OrderId): Promise<void> {
    await this.prismaService.order.delete({
      where: { id: orderId.toString() },
    });
  }

  async update(order: Order): Promise<void> {
    await this.prismaService.order.update({
      where: { id: order.id.toString() },
      data: {
        client_id: order.client?.id.toString(),
        completed_at: order.completedAt,
        order_code: order.orderCode,
        payment_status: order.paymentStatus,
        ready_at: order.readyAt,
        preparation_started: order.preparationStarted,
        status: order.status,
        total: order.calculateTotal(),
        // items: {
        //   updateMany: {
        //     data: order.items.map((item) => {
        //       return {
        //         product_id: item.product.id.toString(),
        //         quantity: item.quantity,
        //         notes: item.notes,
        //       };
        //     }),
        //   },
        // },
      },
    });
  }

  async findById(orderId: OrderId): Promise<Order | null> {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId.toString() },
      include: {
        client: true,
        items: {
          include: {
            product: { include: { category: true } },
          },
        },
      },
    });

    if (!order) return null;

    return Order.create({
      id: new OrderId(order.id),
      items: [],
      completedAt: order.completed_at,
      createdAt: order.created_at,
      orderCode: order.order_code,
      paymentStatus: order.payment_status as StatusPayment,
      preparationStarted: order.preparation_started,
      readyAt: order.ready_at,
      status: order.status as StatusOrder,
      total: order.total,
      client: order.client
        ? Client.create({
            id: new ClientId(order.client.id),
            name: order.client.name,
            email: order.client.email,
            cpf: order.client.cpf,
            createdAt: order.client.created_at,
          })
        : null,
    });
  }

  async findAll(
    limit: number,
    skip: number,
  ): Promise<{ currentPage: number; totalPages: number; data: Order[] }> {
    const orders = await this.prismaService.order.findMany({
      skip,
      take: limit,
      include: {
        client: true,
        items: {
          include: {
            product: { include: { category: true } },
          },
        },
      },
    });

    const totalItems = await this.prismaService.order.count();

    return {
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(totalItems / limit),
      data: orders.map((order) => {
        return Order.create({
          id: new OrderId(order.id),
          items: [],
          completedAt: order.completed_at,
          createdAt: order.created_at,
          orderCode: order.order_code,
          paymentStatus: order.payment_status as StatusPayment,
          preparationStarted: order.preparation_started,
          readyAt: order.ready_at,
          status: order.status as StatusOrder,
          total: order.total,
          client: order.client
            ? Client.create({
                id: new ClientId(order.client.id),
                name: order.client.name,
                email: order.client.email,
                cpf: order.client.cpf,
                createdAt: order.client.created_at,
              })
            : null,
        });
      }),
    };
  }
}
