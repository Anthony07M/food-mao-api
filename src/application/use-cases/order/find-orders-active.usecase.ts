import { Inject, Injectable } from '@nestjs/common';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';

@Injectable()
export class FindOrdersActiveUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async execute(limit: number, skip: number) {
    const { currentPage, totalPages, data } =
      await this.orderRepositoryPersistence.findAllActives(limit, skip);

    return {
      currentPage,
      totalPages,
      data: data.map((item) => {
        return {
          id: item.id.toString(),
          orderCode: item.orderCode,
          status: item.status,
          total: item.total,
          paymentId: item.paymentId,
          notes: item.notes,
          paymentStatus: item.paymentStatus,
          createdAt: item.createdAt,
          preparationStarted: item.preparationStarted,
          readyAt: item.readyAt,
          completedAt: item.completedAt,
          client: item.client
            ? {
                id: item.client.id.toString(),
                name: item.client.name,
                cpf: item.client.cpf,
              }
            : null,
          items: item.items.map((i) => {
            return {
              id: i.id.toString(),
              name: i.product.name,
              notes: i.notes,
              quantity: i.quantity,
            };
          }),
        };
      }),
    };
  }
}
