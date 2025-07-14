import { Injectable } from '@nestjs/common';
import { Category, CategoryId } from 'src/domain/entities/category/category.entity';
import { CategoryRepositoryInterface } from 'src/domain/repositories/category.repository.interface';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';

@Injectable()
export class CategoryRepositoryPersistence
  implements CategoryRepositoryInterface
{
  constructor(private readonly prismaService: PrismaService) {}

  async save(category: Category): Promise<Category> {
    await this.prismaService.category.create({
      data: {
        id: category.id.toString(),
        name: category.name,
        description: category.description,
      },
    });
    return category;
  }

  async remove(categoryId: CategoryId): Promise<void> {
    await this.prismaService.category.delete({
      where: { id: categoryId.toString() },
    });
  }

  async update(category: Category): Promise<Category> {
    await this.prismaService.category.update({
      where: { id: category.id.toString() },
      data: {
        name: category.name,
        description: category.description,
      },
    });
    return category;
  }

  async findById(categoryId: CategoryId): Promise<Category | null> {
    const category = await this.prismaService.category.findFirst({
      where: { id: categoryId.toString() },
    });

    if (!category) return null;

    return new Category({
      id: new CategoryId(category.id),
      name: category.name,
      description: category.description,
    });
  }

  async findAll(
    limit: number,
    skip: number,
  ): Promise<{ currentPage: number; totalPages: number; data: Category[] }> {
    const categories = await this.prismaService.category.findMany({
      skip,
      take: limit,
    });

    const totalItems = await this.prismaService.category.count();

    return {
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(totalItems / limit),
      data: categories.map(
        (category) =>
          new Category({
            id: new CategoryId(category.id),
            name: category.name,
            description: category.description,
          }),
      ),
    };
  }
}
