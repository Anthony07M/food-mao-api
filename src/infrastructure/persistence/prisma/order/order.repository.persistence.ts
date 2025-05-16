import { Injectable } from '@nestjs/common';
import { Order, OrderId } from 'src/domain/entities/order/order.entity';
import { OrderRepositoryInterface } from 'src/domain/repositories/order/order.repository.interface';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';

@Injectable()
export class OrderRepositoryPersistence implements OrderRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async save(order: Order): Promise<void> {
    await this.prismaService.order.create({
      data: {
        id: order.id.toString(),
        creacreatedAt: order.createdAt,
        valueTotal: order.valueTotal as number,
      },
    });
  }
  remove(orderId: OrderId): Promise<void> {
    throw new Error('Method not implemented.');
  }
  update(order: Order): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(orderId: OrderId): Promise<Order | null> {
    throw new Error('Method not implemented.');
  }
  findAll(
    limit: number,
    skip: number,
  ): Promise<{ currentPage: number; totalPages: number; data: Order[] }> {
    throw new Error('Method not implemented.');
  }
}
