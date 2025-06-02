import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderId } from 'src/domain/entities/order/order.entity';
import { OrderItem } from 'src/domain/entities/order_item/order-item.entity';
import { ProductId } from 'src/domain/entities/product.entity';
import { Client, ClientId } from 'src/domain/entities/client/client.entity';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';
import { ProductRepositoryPersistence } from 'src/infrastructure/persistence/prisma/product/product.repository.persistence';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client/client.repository.persistence';

interface OrderItemInput {
  productId: string;
  quantity: number;
  notes?: string | null; 
}

interface ICreateOrderUseCase {
  items: OrderItemInput[];
  clientId?: string | null;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
    private readonly productRepositoryPersistence: ProductRepositoryPersistence,
    private readonly clientRepositoryPersistence: ClientRepositoryPersistence,
  ) {}

  async execute(params: ICreateOrderUseCase) {
    const orderId = new OrderId();

    let client: Client | null = null;
    if (params.clientId) {
      client = await this.clientRepositoryPersistence.findById(
        new ClientId(params.clientId),
      );
      if (!client) {
        throw new NotFoundException(
          `Cliente com ID ${params.clientId} não encontrado`,
        );
      }
    }

    const items: OrderItem[] = [];

    for (const itemInput of params.items) {
      const product = await this.productRepositoryPersistence.findById(
        new ProductId(itemInput.productId),
      );

      if (!product) {
        throw new NotFoundException(
          `Produto com ID ${itemInput.productId} não encontrado`,
        );
      }

      const orderItem = OrderItem.create({
        orderId,
        quantity: itemInput.quantity,
        notes: itemInput.notes, 
        product,
      });

      items.push(orderItem);
    }

    const order = Order.create({
      id: orderId,
      items,
      client,
    });

    order.calculateTotal();

    await this.orderRepositoryPersistence.save(order);

    return {
      id: order.id.toString(),
      orderCode: order.orderCode,
      client: order.client
        ? {
            id: order.client.id.toString(),
            name: order.client.name,
            email: order.client.email,
            cpf: order.client.cpf,
          }
        : null,
      status: order.status,
      total: order.total,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      preparationStarted: order.preparationStarted,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
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
    };
  }
}