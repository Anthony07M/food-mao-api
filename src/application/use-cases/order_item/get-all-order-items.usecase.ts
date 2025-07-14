import { Inject, Injectable } from '@nestjs/common';
import { OrderItemRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order_item/order-item.repository.persistence';

@Injectable()
export class GetAllOrderItemsUseCase {
  constructor(
    @Inject('OrderItemRepositoryInterface')
    private readonly orderItemRepositoryPersistence: OrderItemRepositoryPersistence,
  ) {}

  async execute(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    const { currentPage, data, totalPages } =
      await this.orderItemRepositoryPersistence.findAll(limit, skip);

    return {
      currentPage,
      totalPages,
      data: data.map((orderItem) => ({
        id: orderItem.id.toString(),
        orderId: orderItem.orderId.toString(),
        notes: orderItem.notes,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        product: {
          id: orderItem.product.id.toString(),
          name: orderItem.product.name,
          description: orderItem.product.description,
          price: orderItem.product.price,
          imageUrl: orderItem.product.imageUrl,
          category: {
            id: orderItem.product.category.id.toString(),
            name: orderItem.product.category.name,
            description: orderItem.product.description,
          },
        },
      })),
    };
  }
}
