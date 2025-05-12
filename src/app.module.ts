import { Module } from '@nestjs/common';
import { OrderController } from './adapters/inbound/http/order/order.controller';
import { PrismaService } from './infrastructure/config/prisma/prisma.service';
import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';
import { OrderRepositoryPersistence } from './infrastructure/persistence/prisma/order.repository.persistence';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [PrismaService, CreateOrderUseCase, OrderRepositoryPersistence],
})
export class AppModule {}
