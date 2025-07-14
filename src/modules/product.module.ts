import { Module } from '@nestjs/common';
import { ProductController } from 'src/adapters/inbound/http/product/product.controller';
import { CreateProductUseCase } from 'src/application/use-cases/product/create-product.usecase';
import { FindAllProductsUseCase } from 'src/application/use-cases/product/find-all-products.usecase';
import { FindProductByIdUseCase } from 'src/application/use-cases/product/findById.usecase';
import { RemoveProductUseCase } from 'src/application/use-cases/product/remove-product.usecase';
import { UpdateProductUseCase } from 'src/application/use-cases/product/update-product.usecase';
import { ProductRepositoryPersistence } from 'src/infrastructure/persistence/prisma/product/product.repository.persistence';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import { CategoryModule } from './category.module';

@Module({
  imports: [CategoryModule],
  controllers: [ProductController],
  providers: [
    PrismaService,
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepositoryPersistence,
    },
    CreateProductUseCase,
    FindAllProductsUseCase,
    FindProductByIdUseCase,
    RemoveProductUseCase,
    UpdateProductUseCase,
  ],
  exports: [
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepositoryPersistence,
    },
    CreateProductUseCase,
    FindAllProductsUseCase,
    FindProductByIdUseCase,
    RemoveProductUseCase,
    UpdateProductUseCase,
  ],
})
export class ProductModule {}