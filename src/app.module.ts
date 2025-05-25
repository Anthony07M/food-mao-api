import { Module } from '@nestjs/common';
import { OrderController } from './adapters/inbound/http/order/order.controller';
import { PrismaService } from './infrastructure/config/prisma/prisma.service';
import { CreateOrderUseCase } from './application/use-cases/order/create-order.usecase';
import { UpdateOrderUseCase } from './application/use-cases/order/update-order.usecase';
import { DeleteOrderUseCase } from './application/use-cases/order/delete-order.usecase';
import { GetAllOrdersUseCase } from './application/use-cases/order/get-all-orders.usecase';
import { OrderRepositoryPersistence } from './infrastructure/persistence/prisma/order/order.repository.persistence';
import { CategoryController } from './adapters/inbound/http/category/category.controller';
import { CategoryRepositoryPersistence } from './infrastructure/persistence/prisma/category.repository.persistence';
import { CreateCategoryUseCase } from './application/use-cases/category/create-category.usecase';
import { UpdateCategoryUseCase } from './application/use-cases/category/update-category.usecase';
import { FindAllCategoriesUseCase } from './application/use-cases/category/find-all-categories.usecase';
import { FindCategoryByIdUseCase } from './application/use-cases/category/findById.usecase';
import { CreateProductUseCase } from './application/use-cases/product/create-product.usecase';
import { FindAllProductsUseCase } from './application/use-cases/product/find-all-products.usecase';
import { FindProductByIdUseCase } from './application/use-cases/product/findById.usecase';
import { RemoveProductUseCase } from './application/use-cases/product/remove-product.usecase';
import { UpdateProductUseCase } from './application/use-cases/product/update-product.usecase';
import { ProductRepositoryPersistence } from './infrastructure/persistence/prisma/product.repository.persistence';
import { ProductController } from './adapters/inbound/http/product/product.controller';
import { ClientModule } from './modules/client.module';
import { OrderItemModule } from './modules/order-item.module';
import { FindByIdOrderUseCase } from './application/use-cases/order/findById-order.usecase';

@Module({
  imports: [ClientModule, OrderItemModule],
  controllers: [OrderController, CategoryController, ProductController],
  providers: [
    PrismaService,
    // Order Use Cases
    CreateOrderUseCase,
    FindByIdOrderUseCase,
    UpdateOrderUseCase,
    DeleteOrderUseCase,
    GetAllOrdersUseCase,
    OrderRepositoryPersistence,
    // Category Use Cases
    CategoryRepositoryPersistence,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    FindAllCategoriesUseCase,
    FindCategoryByIdUseCase,
    // Product Use Cases
    ProductRepositoryPersistence,
    CreateProductUseCase,
    FindAllProductsUseCase,
    FindProductByIdUseCase,
    RemoveProductUseCase,
    UpdateProductUseCase,
  ],
})
export class AppModule {}