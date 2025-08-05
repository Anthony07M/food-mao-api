import { Injectable } from '@nestjs/common';
import { Client, ClientId } from 'src/domain/entities/client/client.entity';
import {
  Order,
  OrderId,
  StatusOrder,
  StatusPayment,
} from 'src/domain/entities/order/order.entity';
import {
  OrderItem,
  OrderItemId,
} from 'src/domain/entities/order_item/order-item.entity';
import { Product, ProductId } from 'src/domain/entities/product/product.entity';
import {
  Category,
  CategoryId,
} from 'src/domain/entities/category/category.entity';
import { OrderRepositoryInterface } from 'src/domain/repositories/order/order.repository.interface';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import { PaginatedResult } from 'src/adapters/shared/repositories/repository.interface';

@Injectable()
export class OrderRepositoryPersistence implements OrderRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async save(order: Order): Promise<Order> {
    await this.prismaService.order.create({
      data: {
        id: order.id.toString(),
        order_code: order.orderCode,
        status: order.status,
        total: order.calculateTotal(),
        payment_status: order.paymentStatus,
        created_at: order.createdAt,
        client_id: order.client ? order.client.id.toString() : null,
        completed_at: order.completedAt,
        ready_at: order.readyAt,
        notes: order.notes,
        preparation_started: order.preparationStarted,
        items: {
          createMany: {
            data: order.items.map((item) => ({
              id: item.id.toString(),
              product_id: item.product.id.toString(),
              quantity: item.quantity,
            })),
          },
        },
      },
    });

    return order;
  }

  async remove(orderId: OrderId): Promise<void> {
    await this.prismaService.orderItem.deleteMany({
      where: { order_id: orderId.toString() },
    });

    await this.prismaService.order.delete({
      where: { id: orderId.toString() },
    });
  }

  async update(order: Order): Promise<Order> {
    await this.prismaService.order.update({
      where: { id: order.id.toString() },
      data: {
        client_id: order.client ? order.client.id.toString() : null,
        completed_at: order.completedAt,
        order_code: order.orderCode,
        payment_status: order.paymentStatus,
        ready_at: order.readyAt,
        preparation_started: order.preparationStarted,
        notes: order.notes,
        status: order.status,
        total: order.calculateTotal(),
      },
    });

    return order;
  }

  async findById(orderId: OrderId): Promise<Order | null> {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId.toString() },
      include: {
        client: true,
        items: {
          include: {
            product: { include: { category: true } },
          },
        },
      },
    });

    if (!order) return null;

    const items = order.items.map((itemData) => {
      const category = new Category({
        id: new CategoryId(itemData.product.category.id),
        name: itemData.product.category.name,
        description: itemData.product.category.description,
      });

      const product = new Product({
        id: new ProductId(itemData.product.id),
        name: itemData.product.name,
        description: itemData.product.description,
        price: itemData.product.price,
        imageUrl: itemData.product.imageUrl,
        category,
      });

      return new OrderItem({
        id: new OrderItemId(itemData.id),
        orderId: new OrderId(order.id),
        product,
        quantity: itemData.quantity,
      });
    });

    return new Order({
      id: new OrderId(order.id),
      completedAt: order.completed_at,
      createdAt: order.created_at,
      orderCode: order.order_code,
      paymentStatus: order.payment_status as StatusPayment,
      preparationStarted: order.preparation_started,
      readyAt: order.ready_at,
      status: order.status as StatusOrder,
      total: order.total,
      notes: order.notes,
      items,
      client: order.client
        ? new Client({
            id: new ClientId(order.client.id),
            name: order.client.name,
            email: order.client.email,
            cpf: order.client.cpf,
            createdAt: order.client.created_at,
          })
        : null,
    });
  }

  async findAll(limit: number, skip: number): Promise<PaginatedResult<Order>> {
    const safeLimit = Math.max(1, Math.min(limit, 100));
    const safeSkip = Math.max(0, skip);

    try {
      const orders = await this.prismaService.order.findMany({
        skip: safeSkip,
        take: safeLimit,
        include: {
          client: true,
          items: {
            include: {
              product: { include: { category: true } },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const totalItems = await this.prismaService.order.count();
      const currentPage = Math.floor(safeSkip / safeLimit) + 1;
      const totalPages = Math.ceil(totalItems / safeLimit);

      return {
        currentPage,
        totalPages,
        data: orders.map((order) => {
          const items = order.items.map((itemData) => {
            const category = new Category({
              id: new CategoryId(itemData.product.category.id),
              name: itemData.product.category.name,
              description: itemData.product.category.description,
            });

            const product = new Product({
              id: new ProductId(itemData.product.id),
              name: itemData.product.name,
              description: itemData.product.description,
              price: itemData.product.price,
              imageUrl: itemData.product.imageUrl,
              category,
            });

            return new OrderItem({
              id: new OrderItemId(itemData.id),
              orderId: new OrderId(order.id),
              product,
              quantity: itemData.quantity,
            });
          });

          return new Order({
            id: new OrderId(order.id),
            items,
            completedAt: order.completed_at,
            createdAt: order.created_at,
            orderCode: order.order_code,
            paymentStatus: order.payment_status as StatusPayment,
            preparationStarted: order.preparation_started,
            readyAt: order.ready_at,
            status: order.status as StatusOrder,
            total: order.total,
            notes: order.notes,
            client: order.client
              ? new Client({
                  id: new ClientId(order.client.id),
                  name: order.client.name,
                  email: order.client.email,
                  cpf: order.client.cpf,
                  createdAt: order.client.created_at,
                })
              : null,
          });
        }),
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async findByStatusPayment(statusPayment: string) {
    const orders = await this.prismaService.order.findMany({
      where: { payment_status: statusPayment },
      include: {
        client: true,
        items: {
          include: {
            product: { include: { category: true } },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      data: orders.map((order) => {
        const items = order.items.map((itemData) => {
          const category = new Category({
            id: new CategoryId(itemData.product.category.id),
            name: itemData.product.category.name,
            description: itemData.product.category.description,
          });

          const product = new Product({
            id: new ProductId(itemData.product.id),
            name: itemData.product.name,
            description: itemData.product.description,
            price: itemData.product.price,
            imageUrl: itemData.product.imageUrl,
            category,
          });

          return new OrderItem({
            id: new OrderItemId(itemData.id),
            orderId: new OrderId(order.id),
            product,
            quantity: itemData.quantity,
          });
        });

        return new Order({
          id: new OrderId(order.id),
          items,
          completedAt: order.completed_at,
          createdAt: order.created_at,
          orderCode: order.order_code,
          paymentStatus: order.payment_status as StatusPayment,
          preparationStarted: order.preparation_started,
          readyAt: order.ready_at,
          status: order.status as StatusOrder,
          total: order.total,
          notes: order.notes,
          client: order.client
            ? new Client({
                id: new ClientId(order.client.id),
                name: order.client.name,
                email: order.client.email,
                cpf: order.client.cpf,
                createdAt: order.client.created_at,
              })
            : null,
        });
      }),
    };
  }

  async findAllActives(
    limit: number,
    skip: number,
  ): Promise<{ currentPage: number; totalPages: number; data: Order[] }> {
    const orders = await this.prismaService.order.findMany({
      skip,
      take: limit,
      include: {
        client: true,
        items: {
          include: { product: { include: { category: true } } },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
      where: {
        OR: [
          { status: 'In_Progress' },
          { status: 'Ready' },
          { status: 'Received' },
        ],
      },
    });

    const totalItems = await this.prismaService.order.count();
    const currentPage = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage,
      totalPages,
      data: orders.map((order) => {
        const items = order.items.map((itemData) => {
          const category = new Category({
            id: new CategoryId(itemData.product.category.id),
            name: itemData.product.category.name,
            description: itemData.product.category.description,
          });

          const product = new Product({
            id: new ProductId(itemData.product.id),
            name: itemData.product.name,
            description: itemData.product.description,
            price: itemData.product.price,
            imageUrl: itemData.product.imageUrl,
            category,
          });

          return new OrderItem({
            id: new OrderItemId(itemData.id),
            orderId: new OrderId(order.id),
            product,
            quantity: itemData.quantity,
          });
        });

        return new Order({
          id: new OrderId(order.id),
          items,
          completedAt: order.completed_at,
          createdAt: order.created_at,
          orderCode: order.order_code,
          paymentStatus: order.payment_status as StatusPayment,
          preparationStarted: order.preparation_started,
          readyAt: order.ready_at,
          status: order.status as StatusOrder,
          total: order.total,
          notes: order.notes,
          client: order.client
            ? new Client({
                id: new ClientId(order.client.id),
                name: order.client.name,
                email: order.client.email,
                cpf: order.client.cpf,
                createdAt: order.client.created_at,
              })
            : null,
        });
      }),
    };
  }
}
