/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import { CreateOrderUseCase } from 'src/application/use-cases/order/create-order.usecase';
import { UpdateOrderUseCase } from 'src/application/use-cases/order/update-order.usecase';
import { DeleteOrderUseCase } from 'src/application/use-cases/order/delete-order.usecase';
import { GetAllOrdersUseCase } from 'src/application/use-cases/order/get-all-orders.usecase';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';
import { FindByIdOrderUseCase } from 'src/application/use-cases/order/findById-order.usecase';
import { ProductRepositoryPersistence } from 'src/infrastructure/persistence/prisma/product/product.repository.persistence';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client/client.repository.persistence';

describe('OrderController', () => {
  let controller: OrderController;
  let createOrderUseCase: CreateOrderUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        PrismaService,
        CreateOrderUseCase,
        FindByIdOrderUseCase,
        UpdateOrderUseCase,
        DeleteOrderUseCase,
        GetAllOrdersUseCase,
        OrderRepositoryPersistence,
        ProductRepositoryPersistence,
        ClientRepositoryPersistence,
      ],
      imports: [],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    createOrderUseCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order with simplified payload', async () => {
      const createOrderDto = {
        items: [
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            quantity: 2,
          },
        ],
        clientId: 'client-uuid',
        notes: 'Pedido urgente',
      };

      const expectedResult = {
        id: 'order-uuid',
        orderCode: 'ORD-1234567890',
        client: {
          id: 'client-uuid',
          name: 'João Silva',
          email: 'joao@email.com',
          cpf: '12345678901',
        },
        status: 'Pending',
        total: 5199.32,
        paymentStatus: 'Pending',
        createdAt: new Date(),
        items: [],
      };

      jest
        .spyOn(createOrderUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      expect(createOrderUseCase.execute).toHaveBeenCalledWith({
        items: [
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            quantity: 2,
          },
        ],
        clientId: 'client-uuid',
        notes: 'Pedido urgente',
      });

      expect(result).toEqual(expectedResult);
    });

    it('should create an order without client', async () => {
      const createOrderDto = {
        items: [
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            quantity: 1,
          },
        ],
      };

      const expectedResult = {
        id: 'order-uuid',
        orderCode: 'ORD-1234567890',
        client: null,
        status: 'Pending',
        total: 2599.66,
        paymentStatus: 'Pending',
        createdAt: new Date(),
        items: [],
      };

      jest
        .spyOn(createOrderUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      expect(createOrderUseCase.execute).toHaveBeenCalledWith({
        items: [
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            quantity: 1,
          },
        ],
        clientId: undefined,
        notes: undefined,
      });

      expect(result).toEqual(expectedResult);
    });
  });
});
