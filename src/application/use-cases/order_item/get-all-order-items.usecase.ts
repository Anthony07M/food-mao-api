import { Injectable } from '@nestjs/common';
import { PaginatedResult } from 'src/adapters/shared/repositories/repository.interface';
import { OrderItem } from 'src/domain/entities/order_item/order-item.entity';
import { OrderItemRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order_item/order-item.repository.persistence';

export type GetAllOrderItemsResponse = PaginatedResult<OrderItem>;

@Injectable()
export class GetAllOrderItemsUseCase {
  constructor(
    private readonly orderItemRepositoryPersistence: OrderItemRepositoryPersistence,
  ) {}

  async execute(
    limit: number = 10,
    page: number = 1,
  ): Promise<GetAllOrderItemsResponse> {
    const skip = (page - 1) * limit;

    return this.orderItemRepositoryPersistence.findAll(limit, skip);
  }
}