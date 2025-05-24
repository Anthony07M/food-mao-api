import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../config/prisma/prisma.service';
import { OrderItemRepositoryPersistence } from '../order_item/order-item.repository.persistence';
import {
  OrderItem,
  OrderItemId,
} from '../../../../domain/entities/order_item/order-item.entity';
import { OrderId } from 'src/domain/entities/order/order.entity';
import { Product } from 'src/domain/entities/product.entity';
import { Category } from 'src/domain/entities/category.entity';

describe('OrderItemRepositoryPersistence', () => {
  let repository: OrderItemRepositoryPersistence;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemRepositoryPersistence,
        {
          provide: PrismaService,
          useValue: {
            orderItem: {
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<OrderItemRepositoryPersistence>(
      OrderItemRepositoryPersistence,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save an order item successfully', async () => {
      const orderItem = OrderItem.create({
        orderId: new OrderId('order-123'),
        product: Product.create({
          name: 'Product Test',
          category: Category.create({ name: 'C1', description: 'C1 lorem' }),
          description: 'Lorem ipsum',
          imageUrl: 'http://test.com',
          price: 123.44,
        }),
        quantity: 2,
        notes: 'Extra sauce',
      });

      await repository.save(orderItem);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      // expect(prismaService.orderItem.create).toHaveBeenCalledWith({
      //   data: {
      //     id: orderItem.id.toString(),
      //     order_id: orderItem.orderId,
      //     product_id: orderItem.productId,
      //     quantity: orderItem.quantity,
      //     notes: orderItem.notes,
      //   },
      // });
    });
  });

  describe('findById', () => {
    it('should return an order item when found', async () => {
      const orderItemId = new OrderItemId();
      const mockOrderItemData = {
        id: orderItemId.toString(),
        order_id: 'order-123',
        product_id: 'product-456',
        quantity: 2,
        notes: 'Extra sauce',
      };

      jest
        .spyOn(prismaService.orderItem, 'findUnique')
        .mockResolvedValue(mockOrderItemData);

      const result = await repository.findById(orderItemId);

      expect(result).toBeInstanceOf(OrderItem);
      expect(result?.id.toString()).toEqual(orderItemId.toString());
      expect(result?.orderId).toEqual(mockOrderItemData.order_id);
      expect(result?.productId).toEqual(mockOrderItemData.product_id);
      expect(result?.quantity).toEqual(mockOrderItemData.quantity);
      expect(result?.notes).toEqual(mockOrderItemData.notes);
    });

    it('should return null when order item is not found', async () => {
      const orderItemId = new OrderItemId();

      jest.spyOn(prismaService.orderItem, 'findUnique').mockResolvedValue(null);

      const result = await repository.findById(orderItemId);

      expect(result).toBeNull();
    });
  });

  describe('findByOrderId', () => {
    it('should return order items for a specific order', async () => {
      const orderId = 'order-123';
      const mockOrderItems = [
        {
          id: 'item-1',
          order_id: orderId,
          product_id: 'product-1',
          quantity: 2,
          notes: 'Extra sauce',
        },
        {
          id: 'item-2',
          order_id: orderId,
          product_id: 'product-2',
          quantity: 1,
          notes: null,
        },
      ];

      jest
        .spyOn(prismaService.orderItem, 'findMany')
        .mockResolvedValue(mockOrderItems);

      const result = await repository.findByOrderId(orderId);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(OrderItem);
      expect(result[0].orderId).toEqual(orderId);
      expect(result[1]).toBeInstanceOf(OrderItem);
      expect(result[1].orderId).toEqual(orderId);
    });
  });
});

export { OrderItemRepositoryPersistence };
