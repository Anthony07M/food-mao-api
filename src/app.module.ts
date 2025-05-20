import { Module } from '@nestjs/common';
import { OrderController } from './adapters/inbound/http/order/order.controller';
import { PrismaService } from './infrastructure/config/prisma/prisma.service';
import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';
import { OrderRepositoryPersistence } from './infrastructure/persistence/prisma/order.repository.persistence';
import { CategoryController } from './adapters/inbound/http/category/category.controller';
import { CategoryRepositoryPersistence } from './infrastructure/persistence/prisma/category.repository.persistence';
import { CreateCategoryUseCase } from './application/use-cases/category/create-category.usecase';
import { UpdateCategoryUseCase } from './application/use-cases/category/update-category.usecase';
import { FindAllCategoriesUseCase } from './application/use-cases/category/find-all-categories.usecase';
import { FindCategoryByIdUseCase } from './application/use-cases/category/findById.usecase';

@Module({
  imports: [],
  controllers: [OrderController, CategoryController],
  providers: [
    PrismaService,
    CreateOrderUseCase,
    CategoryRepositoryPersistence,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    UpdateCategoryUseCase,
    FindAllCategoriesUseCase,
    OrderRepositoryPersistence,
    FindCategoryByIdUseCase,
  ],
})
export class AppModule {}
