import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';

@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async execute(limit: number, skip: number) {
    const validLimit = Math.max(1, Math.min(limit || 10, 100));
    const validSkip = Math.max(0, skip || 0);

    if (validLimit < 1 || validLimit > 100) {
      throw new BadRequestException('Limit deve estar entre 1 e 100');
    }

    if (validSkip < 0) {
      throw new BadRequestException('Skip não pode ser negativo');
    }

    try {
      const result = await this.orderRepositoryPersistence.findAll(
        validLimit,
        validSkip,
      );

      return {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        data: result.data.map((order) => ({
          id: order.id.toString(),
          orderCode: order.orderCode,
          status: order.status,
          total: order.calculateTotal(),
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          preparationStarted: order.preparationStarted,
          readyAt: order.readyAt,
          completedAt: order.completedAt,
          client: order.client
            ? {
                id: order.client.id.toString(),
                name: order.client.name,
                email: order.client.email,
                cpf: order.client.cpf,
              }
            : null,
          items: order.items.map((item) => ({
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
          })),
        })),
      };
    } catch (error) {
      console.error('Erro no UseCase GetAllOrders:', error);
      throw error;
    }
  }
}
