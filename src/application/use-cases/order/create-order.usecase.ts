import { Injectable } from '@nestjs/common';
import { Category, CategoryId } from 'src/domain/entities/category.entity';
import { Order, OrderId } from 'src/domain/entities/order/order.entity';
import { OrderItem } from 'src/domain/entities/order_item/order-item.entity';
import { Product, ProductId } from 'src/domain/entities/product.entity';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';

interface Item {
  quantity: number;
  notes?: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: {
      id: string;
      name: string;
      description: string;
    };
  };
}

interface ICreateOrderUseCase {
  // total: number; // validar se faz sentido receber o total do client/usuario. Por abrir brecha de seguranaça
  items: Item[];
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async execute(params: ICreateOrderUseCase) {
    const orderId = new OrderId();

    const items = params.items.map(({ product, quantity, notes }) => {
      return OrderItem.create({
        orderId,
        quantity,
        notes,
        product: Product.create({
          id: new ProductId(product.id),
          description: product.description,
          imageUrl: product.imageUrl,
          name: product.name,
          price: product.price,
          category: Category.create({
            id: new CategoryId(product.category.id),
            name: product.category.name,
            description: product.category.description,
          }),
        }),
      });
    });

    const order = Order.create({ id: orderId, items });

    await this.orderRepositoryPersistence.save(order);

    return {
      id: order.id.toString(),
      orderCode: order.orderCode,
      client: order.client,
      status: order.status,
      total: order.calculateTotal(),
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      preparationStarted: order.preparationStarted,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
      items: order.items.map((item) => {
        return {
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
        };
      }),
    };
  }
}
