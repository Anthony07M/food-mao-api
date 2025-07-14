import { Inject, Injectable } from '@nestjs/common';
import { Order } from 'src/domain/entities/order/order.entity';
import { OrderRepositoryInterface } from 'src/domain/repositories/order/order.repository.interface';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async execute(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }
}
