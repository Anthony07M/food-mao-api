import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import { CreateOrderUseCase } from 'src/application/use-cases/order/create-order.usecase';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order.repository.persistence';

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        PrismaService,
        CreateOrderUseCase,
        OrderRepositoryPersistence,
      ],
      imports: [],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
