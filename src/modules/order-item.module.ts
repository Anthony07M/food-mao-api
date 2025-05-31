import { Module } from '@nestjs/common';
import { OrderItemController } from 'src/adapters/inbound/http/order_item/order-item.controller';
import { PaymentController } from 'src/adapters/outbound/http/payment/payment.controller';
import { CreateOrderItemUseCase } from 'src/application/use-cases/order_item/create-order-item.usecase';
import { GetAllOrderItemsUseCase } from 'src/application/use-cases/order_item/get-all-order-items.usecase';
import { GetOrderItemByIdUseCase } from 'src/application/use-cases/order_item/get-order-item-by-id.usecase';
import { GetOrderItemsByOrderUseCase } from 'src/application/use-cases/order_item/get-order-items-by-order.usecase';
import { UpdateOrderItemUseCase } from 'src/application/use-cases/order_item/update-order-item.usecase';
import { DeleteOrderItemUseCase } from 'src/application/use-cases/order_item/delete-order-item.usecase';
import { PaymentUseCase } from 'src/application/use-cases/payment/payment.usecase';
import { OrderItemRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order_item/order-item.repository.persistence';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';

@Module({
  controllers: [OrderItemController, PaymentController],
  providers: [
    PrismaService,
    OrderItemRepositoryPersistence,
    CreateOrderItemUseCase,
    GetAllOrderItemsUseCase,
    GetOrderItemByIdUseCase,
    GetOrderItemsByOrderUseCase,
    UpdateOrderItemUseCase,
    DeleteOrderItemUseCase,
    PaymentUseCase,
  ],
  exports: [
    OrderItemRepositoryPersistence,
    CreateOrderItemUseCase,
    GetAllOrderItemsUseCase,
    GetOrderItemByIdUseCase,
    GetOrderItemsByOrderUseCase,
    UpdateOrderItemUseCase,
    DeleteOrderItemUseCase,
    PaymentUseCase,
  ],
})
export class OrderItemModule {}
