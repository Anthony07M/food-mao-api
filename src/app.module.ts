import { Module } from '@nestjs/common';
import { OrderController } from './adapters/inbound/http/order/order.controller';
import { PrismaService } from './infrastructure/config/prisma/prisma.service';
import { CreateOrderUseCase } from './application/use-cases/order/create-order.usecase';
import { OrderRepositoryPersistence } from './infrastructure/persistence/prisma/order/order.repository.persistence';
import { ClientModule } from 'src/modules/client.module';

@Module({
  imports: [ClientModule],
  controllers: [OrderController],
  providers: [PrismaService, CreateOrderUseCase, OrderRepositoryPersistence],
})
export class AppModule {}
