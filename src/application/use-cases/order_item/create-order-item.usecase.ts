import { Inject, Injectable } from '@nestjs/common';
import { OrderItem } from 'src/domain/entities/order_item/order-item.entity';
import { OrderItemRepositoryInterface } from 'src/domain/repositories/order_item/order-item.repository.interface';

interface ICreateOrderItemUseCase {
  orderId: string;
  productId: string;
  quantity: number;
  notes?: string;
}

@Injectable()
export class CreateOrderItemUseCase {
  constructor(
    @Inject('OrderItemRepositoryInterface')
    private readonly orderItemRepository: OrderItemRepositoryInterface,
  ) {}

  async execute(params: ICreateOrderItemUseCase) {
    // const orderItem = OrderItem.create({
    //   // orderId: params.orderId,
    //   productId: params.productId,
    //   quantity: params.quantity,
    //   notes: params.notes,
    // });
    // await this.orderItemRepositoryPersistence.save(orderItem);
    // return orderItem;
  }
}
