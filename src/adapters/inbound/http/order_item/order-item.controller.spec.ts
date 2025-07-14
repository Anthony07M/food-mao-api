import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './order-item.controller';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import { CreateOrderItemUseCase } from 'src/application/use-cases/order_item/create-order-item.usecase';
import { GetAllOrderItemsUseCase } from 'src/application/use-cases/order_item/get-all-order-items.usecase';
import { GetOrderItemByIdUseCase } from 'src/application/use-cases/order_item/get-order-item-by-id.usecase';
import { GetOrderItemsByOrderUseCase } from 'src/application/use-cases/order_item/get-order-items-by-order.usecase';
import { UpdateOrderItemUseCase } from 'src/application/use-cases/order_item/update-order-item.usecase';
import { DeleteOrderItemUseCase } from 'src/application/use-cases/order_item/delete-order-item.usecase';
import { OrderItemRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order_item/order-item.repository.persistence';

describe('OrderItemController', () => {
  let controller: OrderItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        PrismaService,
        {
          provide: 'OrderItemRepositoryInterface',
          useClass: OrderItemRepositoryPersistence,
        },
        CreateOrderItemUseCase,
        GetAllOrderItemsUseCase,
        GetOrderItemByIdUseCase,
        GetOrderItemsByOrderUseCase,
        UpdateOrderItemUseCase,
        DeleteOrderItemUseCase,
      ],
    }).compile();

    controller = module.get<OrderItemController>(OrderItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
