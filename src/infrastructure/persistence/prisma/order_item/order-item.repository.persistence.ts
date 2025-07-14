import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import {
  OrderItem,
  OrderItemId,
} from 'src/domain/entities/order_item/order-item.entity';
import { OrderItemRepositoryInterface } from 'src/domain/repositories/order_item/order-item.repository.interface';
import { PaginatedResult } from 'src/adapters/shared/repositories/repository.interface';
import { OrderId } from 'src/domain/entities/order/order.entity';
import { Product, ProductId } from 'src/domain/entities/product/product.entity';
import { Category, CategoryId } from 'src/domain/entities/category/category.entity';

@Injectable()
export class OrderItemRepositoryPersistence
  implements OrderItemRepositoryInterface
{
  constructor(private readonly prismaService: PrismaService) {}

  async save(entity: OrderItem): Promise<OrderItem> {
    await this.prismaService.orderItem.create({
      data: {
        id: entity.id.toString(),
        order_id: entity.orderId.toString(),
        product_id: entity.product.id.toString(),
        quantity: entity.quantity,
      },
    });
    
    return entity;
  }

  async remove(entityId: OrderItemId): Promise<void> {
    await this.prismaService.orderItem.delete({
      where: {
        id: entityId.toString(),
      },
    });
  }

  async update(entity: OrderItem): Promise<OrderItem> {
    await this.prismaService.orderItem.update({
      where: {
        id: entity.id.toString(),
      },
      data: {
        order_id: entity.orderId.toString(),
        product_id: entity.product.id.toString(),
        quantity: entity.quantity,
      },
    });
    
    return entity;
  }

  async findById(entityId: OrderItemId): Promise<OrderItem | null> {
    const orderItem = await this.prismaService.orderItem.findUnique({
      where: {
        id: entityId.toString(),
      },
      include: { product: { include: { category: true } } },
    });
    
    if (!orderItem) {
      return null;
    }

    return new OrderItem({
      id: new OrderItemId(orderItem.id),
      orderId: new OrderId(orderItem.order_id),
      quantity: orderItem.quantity,
      product: new Product({
        id: new ProductId(orderItem.product.id),
        name: orderItem.product.name,
        price: orderItem.product.price,
        description: orderItem.product.description,
        imageUrl: orderItem.product.imageUrl,
        category: new Category({
          id: new CategoryId(orderItem.product.category.id),
          description: orderItem.product.category.description,
          name: orderItem.product.category.name,
        }),
      }),
    });
  }

  async findAll(
    limit: number,
    skip: number,
  ): Promise<PaginatedResult<OrderItem>> {
    const total = await this.prismaService.orderItem.count();
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    const orderItems = await this.prismaService.orderItem.findMany({
      skip,
      take: limit,
      include: { order: true, product: { include: { category: true } } },
    });

    return {
      currentPage,
      totalPages,
      data: orderItems?.map((orderItem) => {
        return new OrderItem({
          id: new OrderItemId(orderItem.id),
          orderId: new OrderId(orderItem.order_id),
          quantity: orderItem.quantity,
          product: new Product({
            id: new ProductId(orderItem.product.id),
            name: orderItem.product.name,
            price: orderItem.product.price,
            description: orderItem.product.description,
            imageUrl: orderItem.product.imageUrl,
            category: new Category({
              id: new CategoryId(orderItem.product.category.id),
              description: orderItem.product.category.description,
              name: orderItem.product.category.name,
            }),
          }),
        });
      }),
    };
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const orderItems = await this.prismaService.orderItem.findMany({
      where: {
        order_id: orderId,
      },
      include: { order: true, product: { include: { category: true } } },
    });

    return orderItems.map((orderItem) =>
      new OrderItem({
        id: new OrderItemId(orderItem.id),
        orderId: new OrderId(orderItem.order_id),
        product: new Product({
          id: new ProductId(orderItem.product.id),
          name: orderItem.product.name,
          price: orderItem.product.price,
          description: orderItem.product.description,
          imageUrl: orderItem.product.imageUrl,
          category: new Category({
            id: new CategoryId(orderItem.product.category.id),
            description: orderItem.product.category.description,
            name: orderItem.product.category.name,
          }),
        }),
        quantity: orderItem.quantity,
      }),
    );
  }
}