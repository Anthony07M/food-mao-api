import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import { CreateOrderUseCase } from 'src/application/use-cases/order/create-order.usecase';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';
import { FindByIdOrderUseCase } from 'src/application/use-cases/order/findById-order.usecase';

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        PrismaService,
        CreateOrderUseCase,
        OrderRepositoryPersistence,
        FindByIdOrderUseCase,
      ],
      imports: [],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
