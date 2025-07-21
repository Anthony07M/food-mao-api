import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentController } from './adapters/outbound/http/payment/payment.controller';

import { PrismaService } from './infrastructure/config/prisma/prisma.service';
import { MercadoPagoService } from './infrastructure/config/mercadoPago/mercado-pago.service';
import { PaymentUseCase } from './application/use-cases/payment/payment.usecase';
import { PaymentRepositoryPersistence } from './infrastructure/persistence/mercadoPago/payment.repository.persistence';
import { ClientModule } from './modules/client.module';
import { OrderItemModule } from './modules/order-item.module';
import { LoggerMiddleware } from './adapters/inbound/http/morgan/morgan.middleware';
import { TasksServiceCheckoutPayment } from './adapters/outbound/auto/payment/payment.cron';
import { CategoryModule } from './modules/category.module';
import { ProductModule } from './modules/product.module';
import { OrderModule } from './modules/order.module';
import { HealthController } from './adapters/inbound/http/health/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ClientModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    OrderItemModule,
  ],
  controllers: [PaymentController, HealthController],
  providers: [
    PrismaService,
    MercadoPagoService,
    {
      provide: 'PaymentRepositoryInterface',
      useClass: PaymentRepositoryPersistence,
    },
    PaymentRepositoryPersistence,
    PaymentUseCase,
    TasksServiceCheckoutPayment,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
