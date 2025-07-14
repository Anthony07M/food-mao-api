import { Module } from '@nestjs/common';
import { OrderController } from 'src/adapters/inbound/http/order/order.controller';
import { CreateOrderUseCase } from 'src/application/use-cases/order/create-order.usecase';
import { DeleteOrderUseCase } from 'src/application/use-cases/order/delete-order.usecase';
import { FindByIdOrderUseCase } from 'src/application/use-cases/order/findById-order.usecase';
import { GetAllOrdersUseCase } from 'src/application/use-cases/order/get-all-orders.usecase';
import { UpdateOrderUseCase } from 'src/application/use-cases/order/update-order.usecase';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import { ClientModule } from './client.module';
import { ProductModule } from './product.module';

@Module({
  imports: [ClientModule, ProductModule],
  controllers: [OrderController],
  providers: [
    PrismaService,
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepositoryPersistence,
    },
    CreateOrderUseCase,
    DeleteOrderUseCase,
    FindByIdOrderUseCase,
    GetAllOrdersUseCase,
    UpdateOrderUseCase,
  ],
  exports: [
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepositoryPersistence,
    },
    CreateOrderUseCase,
    DeleteOrderUseCase,
    FindByIdOrderUseCase,
    GetAllOrdersUseCase,
    UpdateOrderUseCase,
  ],
})
export class OrderModule {}