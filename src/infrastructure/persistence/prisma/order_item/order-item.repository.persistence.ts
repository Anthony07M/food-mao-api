import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  getPrismaWithClient,
} from 'src/infrastructure/config/prisma/prisma.service';
import {
  OrderItem,
  OrderItemId,
} from 'src/domain/entities/order_item/order-item.entity';
import { OrderItemRepositoryInterface } from 'src/domain/repositories/order_item/order-item.repository.interface';
import { PaginatedResult } from 'src/adapters/shared/repositories/repository.interface';

@Injectable()
export class OrderItemRepositoryPersistence
  implements OrderItemRepositoryInterface
{
  constructor(private readonly prismaService: PrismaService) {}

  async save(entity: OrderItem): Promise<void> {
    const prisma = getPrismaWithClient(this.prismaService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await (prisma as any).orderItem.create({
      data: {
        id: entity.id.toString(),
        order_id: entity.orderId,
        product_id: entity.productId,
        quantity: entity.quantity,
        notes: entity.notes,
      },
    });
  }

  async remove(entityId: OrderItemId): Promise<void> {
    const prisma = getPrismaWithClient(this.prismaService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await (prisma as any).orderItem.delete({
      where: {
        id: entityId.toString(),
      },
    });
  }

  async update(entity: OrderItem): Promise<void> {
    const prisma = getPrismaWithClient(this.prismaService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await (prisma as any).orderItem.update({
      where: {
        id: entity.id.toString(),
      },
      data: {
        order_id: entity.orderId,
        product_id: entity.productId,
        quantity: entity.quantity,
        notes: entity.notes,
      },
    });
  }

  async findById(entityId: OrderItemId): Promise<OrderItem | null> {
    const prisma = getPrismaWithClient(this.prismaService);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const orderItem = await (prisma as any).orderItem.findUnique({
      where: {
        id: entityId.toString(),
      },
    });

    if (!orderItem) {
      return null;
    }

    return OrderItem.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      id: new OrderItemId(orderItem.id),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      orderId: orderItem.order_id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      product: orderItem.product_id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      quantity: orderItem.quantity,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      notes: orderItem.notes,
    });
  }

  async findAll(
    limit: number,
    skip: number,
  ): Promise<PaginatedResult<OrderItem>> {
    const prisma = getPrismaWithClient(this.prismaService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const total = await (prisma as any).orderItem.count();
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const orderItems = await (prisma as any).orderItem.findMany({
      skip,
      take: limit,
    });

    return {
      currentPage,
      totalPages,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      data: orderItems.map((orderItem) =>
        OrderItem.create({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
          id: new OrderItemId(orderItem.id),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          orderId: orderItem.order_id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          product: orderItem.product_id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          quantity: orderItem.quantity,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          notes: orderItem.notes,
        }),
      ),
    };
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const prisma = getPrismaWithClient(this.prismaService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const orderItems = await (prisma as any).orderItem.findMany({
      where: {
        order_id: orderId,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return orderItems.map((orderItem) =>
      OrderItem.create({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        id: new OrderItemId(orderItem.id),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        orderId: orderItem.order_id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        product: orderItem.product_id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        quantity: orderItem.quantity,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        notes: orderItem.notes,
      }),
    );
  }
}
