/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../config/prisma/prisma.service';
import { OrderRepositoryPersistence } from '../order/order.repository.persistence';
import { Order, OrderId } from '../../../../domain/entities/order/order.entity';
import {
  OrderItem,
  OrderItemId,
} from '../../../../domain/entities/order_item/order-item.entity';
import { Product, ProductId } from '../../../../domain/entities/product/product.entity';
import { Category, CategoryId } from '../../../../domain/entities/category/category.entity';
import { Client, ClientId } from '../../../../domain/entities/client/client.entity';

describe('OrderRepositoryPersistence', () => {
  let repository: OrderRepositoryPersistence;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    orderItem: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepositoryPersistence,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<OrderRepositoryPersistence>(
      OrderRepositoryPersistence,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    // it('should save an order successfully', async () => {
    //   // Arrange
    //   const category = Category.create({
    //     name: 'Electronics',
    //     description: 'Electronic products',
    //   });

    //   const product = Product.create({
    //     name: 'Smartphone',
    //     description: 'Latest smartphone',
    //     price: 999.99,
    //     imageUrl: 'http://example.com/phone.jpg',
    //     category,
    //   });

    //   const orderItem = OrderItem.create({
    //     orderId: new OrderId(),
    //     quantity: 2,
    //     product,
    //   });

    //   const order = Order.create({
    //     items: [orderItem],
    //   });

    //   mockPrismaService.order.create.mockResolvedValue(undefined);

    //   // Act
    //   await repository.save(order);

    //   // Assert
    //   expect(mockPrismaService.order.create).toHaveBeenCalledWith({
    //     data: {
    //       id: order.id.toString(),
    //       order_code: order.orderCode,
    //       status: order.status,
    //       total: order.calculateTotal(),
    //       payment_status: order.paymentStatus,
    //       created_at: order.createdAt,
    //       client_id: null,
    //       completed_at: order.completedAt,
    //       ready_at: order.readyAt,
    //       preparation_started: order.preparationStarted,
    //       items: {
    //         createMany: {
    //           data: [
    //             {
    //               id: orderItem.id.toString(),
    //               product_id: product.id.toString(),
    //               quantity: 2,
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   });
    // });
  });

  describe('findById', () => {
    it('should return an order when found', async () => {
      // Arrange
      const orderId = new OrderId();
      const categoryId = new CategoryId();
      const productId = new ProductId();
      const orderItemId = new OrderItemId();

      const mockOrderData = {
        id: orderId.toString(),
        order_code: 'ORD-123456',
        status: 'Pending',
        total: 1999.98,
        payment_status: 'Pending',
        created_at: new Date(),
        client_id: null,
        client: null,
        completed_at: null,
        ready_at: null,
        preparation_started: null,
        items: [
          {
            id: orderItemId.toString(),
            order_id: orderId.toString(),
            product_id: productId.toString(),
            quantity: 2,
            product: {
              id: productId.toString(),
              name: 'Smartphone',
              description: 'Latest smartphone',
              price: 999.99,
              imageUrl: 'http://example.com/phone.jpg', // Corrigido: imageUrl em vez de image_url
              category_id: categoryId.toString(),
              category: {
                id: categoryId.toString(),
                name: 'Electronics',
                description: 'Electronic products',
              },
            },
          },
        ],
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrderData);

      // Act
      const result = await repository.findById(orderId);

      // Assert
      expect(result).toBeInstanceOf(Order);
      expect(result?.id.toString()).toEqual(orderId.toString());
      expect(result?.orderCode).toEqual('ORD-123456');
      expect(result?.status).toEqual('Pending');
      expect(result?.items).toHaveLength(1);
      expect(result?.items[0]).toBeInstanceOf(OrderItem);
      expect(result?.items[0].product).toBeInstanceOf(Product);
      expect(result?.items[0].product.category).toBeInstanceOf(Category);

      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
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
    });

    it('should return null when order is not found', async () => {
      // Arrange
      const orderId = new OrderId();
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findById(orderId);

      // Assert
      expect(result).toBeNull();
    });

    it('should return an order with client when client exists', async () => {
      // Arrange
      const orderId = new OrderId();
      const clientId = new ClientId();

      const mockOrderData = {
        id: orderId.toString(),
        order_code: 'ORD-123456',
        status: 'Pending',
        total: 1999.98,
        payment_status: 'Pending',
        created_at: new Date(),
        client_id: clientId.toString(),
        completed_at: null,
        ready_at: null,
        preparation_started: null,
        client: {
          id: clientId.toString(),
          name: 'John Doe',
          email: 'john@example.com',
          cpf: '12345678901',
          created_at: new Date(),
        },
        items: [],
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrderData);

      // Act
      const result = await repository.findById(orderId);

      // Assert
      expect(result).toBeInstanceOf(Order);
      expect(result?.client).toBeInstanceOf(Client);
      expect(result?.client?.name).toEqual('John Doe');
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      // Arrange
      const order = Order.create({
        items: [],
        notes: null,
        status: 'In_Progress',
        paymentStatus: 'Concluded',
      });

      mockPrismaService.order.update.mockResolvedValue(undefined);

      // Act
      await repository.update(order);

      // Assert
      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: order.id.toString() },
        data: {
          client_id: null,
          completed_at: order.completedAt,
          notes: null,
          order_code: order.orderCode,
          payment_status: order.paymentStatus,
          ready_at: order.readyAt,
          preparation_started: order.preparationStarted,
          status: order.status,
          total: order.calculateTotal(),
        },
      });
    });
  });

  describe('remove', () => {
    it('should remove an order and its items successfully', async () => {
      // Arrange
      const orderId = new OrderId();
      mockPrismaService.orderItem.deleteMany.mockResolvedValue(undefined);
      mockPrismaService.order.delete.mockResolvedValue(undefined);

      // Act
      await repository.remove(orderId);

      // Assert
      expect(mockPrismaService.orderItem.deleteMany).toHaveBeenCalledWith({
        where: { order_id: orderId.toString() },
      });
      expect(mockPrismaService.order.delete).toHaveBeenCalledWith({
        where: { id: orderId.toString() },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      // Arrange
      const limit = 10;
      const skip = 0;
      const validUuid1 = '550e8400-e29b-41d4-a716-446655440000';
      const validUuid2 = '550e8400-e29b-41d4-a716-446655440001';
      
      const mockOrdersData = [
        {
          id: validUuid1,
          order_code: 'ORD-123',
          status: 'Pending',
          total: 100,
          payment_status: 'Pending',
          created_at: new Date(),
          client_id: null,
          client: null,
          completed_at: null,
          ready_at: null,
          preparation_started: null,
          items: [],
        },
        {
          id: validUuid2,
          order_code: 'ORD-456',
          status: 'Concluded',
          total: 200,
          payment_status: 'Concluded',
          created_at: new Date(),
          client_id: null,
          client: null,
          completed_at: new Date(),
          ready_at: new Date(),
          preparation_started: new Date(),
          items: [],
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(mockOrdersData);
      mockPrismaService.order.count.mockResolvedValue(25);

      // Act
      const result = await repository.findAll(limit, skip);

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(3);
      expect(result.data[0]).toBeInstanceOf(Order);
      expect(result.data[1]).toBeInstanceOf(Order);

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        skip,
        take: limit,
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
      expect(mockPrismaService.order.count).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      // Arrange
      const limit = 10;
      const skip = 0;

      mockPrismaService.order.findMany.mockResolvedValue([]);
      mockPrismaService.order.count.mockResolvedValue(0);

      // Act
      const result = await repository.findAll(limit, skip);

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(0);
    });
  });
});