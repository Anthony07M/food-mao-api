import { Module } from '@nestjs/common';
import { CategoryController } from 'src/adapters/inbound/http/category/category.controller';
import { CreateCategoryUseCase } from 'src/application/use-cases/category/create-category.usecase';
import { FindAllCategoriesUseCase } from 'src/application/use-cases/category/find-all-categories.usecase';
import { FindCategoryByIdUseCase } from 'src/application/use-cases/category/findById.usecase';
import { UpdateCategoryUseCase } from 'src/application/use-cases/category/update-category.usecase';
import { CategoryRepositoryPersistence } from 'src/infrastructure/persistence/prisma/category/category.repository.persistence';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [
    PrismaService,
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepositoryPersistence,
    },
    CreateCategoryUseCase,
    FindAllCategoriesUseCase,
    FindCategoryByIdUseCase,
    UpdateCategoryUseCase,
  ],
  exports: [
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepositoryPersistence,
    },
    CreateCategoryUseCase,
    FindAllCategoriesUseCase,
    FindCategoryByIdUseCase,
    UpdateCategoryUseCase,
  ],
})
export class CategoryModule {}