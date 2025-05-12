import { Injectable } from '@nestjs/common';
import { Order } from 'src/domain/entities/order.entity';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order.repository.persistence';

interface ICreateOrderUseCase {
  total: number;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async execute(params: ICreateOrderUseCase) {
    const order = Order.create({ valueTotal: params.total });
    await this.orderRepositoryPersistence.save(order);
    return order;
  }
}
