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
import {
  StatusOrder,
  StatusPayment,
} from 'src/domain/entities/order/order.entity';

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
            notes: 'Sem cebola', // Adicionado notes ao item
          },
        ],
        clientId: 'client-uuid',
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
        status: 'Pending' as StatusOrder, // ✅ Tipo correto
        total: 5199.32,
        paymentStatus: 'Pending' as StatusPayment, // ✅ Tipo correto
        createdAt: new Date(),
        preparationStarted: null,
        readyAt: null,
        completedAt: null,
        items: [
          {
            id: 'item-uuid',
            quantity: 2,
            notes: 'Sem cebola',
            product: {
              id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              name: 'Produto Teste',
              price: 2599.66,
              description: 'Descrição do produto',
              imageUrl: 'http://produto.png',
              category: {
                id: 'category-uuid',
                name: 'Categoria Teste',
                description: 'Descrição da categoria',
              },
            },
          },
        ],
      };

      jest
        .spyOn(createOrderUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      expect(createOrderUseCase.execute).toHaveBeenCalledWith({
        clientId: 'client-uuid',
        items: [
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            quantity: 2,
            notes: 'Sem cebola', // ✅ Notes agora está no item
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    });

    it('should create an order without client', async () => {
      const createOrderDto = {
        items: [
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            quantity: 1,
            // notes é opcional - não incluído neste teste
          },
        ],
      };

      const expectedResult = {
        id: 'order-uuid',
        orderCode: 'ORD-1234567890',
        client: null,
        status: 'Pending' as StatusOrder, // ✅ Tipo correto
        total: 2599.66,
        paymentStatus: 'Pending' as StatusPayment, // ✅ Tipo correto
        createdAt: new Date(),
        preparationStarted: null,
        readyAt: null,
        completedAt: null,
        items: [
          {
            id: 'item-uuid',
            quantity: 1,
            notes: null, // Sem notes neste item
            product: {
              id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              name: 'Produto Teste',
              price: 2599.66,
              description: 'Descrição do produto',
              imageUrl: 'http://produto.png',
              category: {
                id: 'category-uuid',
                name: 'Categoria Teste',
                description: 'Descrição da categoria',
              },
            },
          },
        ],
      };

      jest
        .spyOn(createOrderUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      expect(createOrderUseCase.execute).toHaveBeenCalledWith({
        clientId: undefined,
        items: [
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            quantity: 1,
            notes: undefined, // ✅ Notes undefined quando não fornecido
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    });

    it('should create an order with multiple items having different notes', async () => {
      const createOrderDto = {
        items: [
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            quantity: 2,
            notes: 'Sem cebola',
          },
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
            quantity: 1,
            notes: 'Bem passado',
          },
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
            quantity: 3,
            // notes não incluído (opcional)
          },
        ],
        clientId: 'client-uuid',
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
        status: 'Pending' as StatusOrder, // ✅ Tipo correto
        total: 15000.0,
        paymentStatus: 'Pending' as StatusPayment, // ✅ Tipo correto
        createdAt: new Date(),
        preparationStarted: null,
        readyAt: null,
        completedAt: null,
        items: [
          {
            id: 'item-uuid-1',
            quantity: 2,
            notes: 'Sem cebola',
            product: {
              id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              name: 'X-caboquinho',
              price: 19.2,
              description: 'x-caboquinho no pão',
              imageUrl: 'http://x-caboquinho.png',
              category: {
                id: 'category-uuid',
                name: 'Sanduiches',
                description: 'Sanduíches artesanais',
              },
            },
          },
          {
            id: 'item-uuid-2',
            quantity: 1,
            notes: 'Bem passado',
            product: {
              id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
              name: 'X-Tudo',
              price: 12.43,
              description: 'X-tudo completo',
              imageUrl: 'http://x-tudo.png',
              category: {
                id: 'category-uuid',
                name: 'Sanduiches',
                description: 'Sanduíches artesanais',
              },
            },
          },
          {
            id: 'item-uuid-3',
            quantity: 3,
            notes: null,
            product: {
              id: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
              name: 'Coca-cola zero',
              price: 15,
              description: 'Coca-cola zero açúcar',
              imageUrl: 'http://coca-cola.png',
              category: {
                id: 'category-uuid-2',
                name: 'Bebidas',
                description: 'Bebidas geladas',
              },
            },
          },
        ],
      };

      jest
        .spyOn(createOrderUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);

      expect(createOrderUseCase.execute).toHaveBeenCalledWith({
        clientId: 'client-uuid',
        items: [
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            quantity: 2,
            notes: 'Sem cebola',
          },
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
            quantity: 1,
            notes: 'Bem passado',
          },
          {
            productId: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
            quantity: 3,
            notes: undefined,
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    });
  });
});
