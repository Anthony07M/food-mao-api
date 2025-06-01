import { Injectable } from '@nestjs/common';
import { Category, CategoryId } from 'src/domain/entities/category.entity';
import { Product, ProductId } from 'src/domain/entities/product.entity';
import { ProductRepositoryInterface } from 'src/domain/repositories/product.repository.interface';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';

@Injectable()
export class ProductRepositoryPersistence
  implements ProductRepositoryInterface
{
  constructor(private readonly prismaService: PrismaService) {}

  async save(product: Product): Promise<void> {
    await this.prismaService.product.create({
      data: {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        categoryId: product.category.id.toString(),
      },
    });
  }

  async remove(productId: ProductId): Promise<void> {
    await this.prismaService.product.delete({
      where: { id: productId.toString() },
    });
  }

  async update(product: Product): Promise<void> {
    await this.prismaService.product.update({
      where: { id: product.id.toString() },
      data: {
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        categoryId: product.category.id.toString(),
      },
    });
  }

  async findById(productId: ProductId): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId.toString() },
      include: { category: true },
    });

    if (!product) return null;

    return Product.create({
      id: new ProductId(product.id),
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: Category.create({
        id: new CategoryId(product.category.id),
        name: product.category.name,
        description: product.category.description,
      }),
    });
  }

  async findAll(
    limit: number,
    skip: number,
  ): Promise<{ currentPage: number; totalPages: number; data: Product[] }> {
    const products = await this.prismaService.product.findMany({
      skip,
      take: limit,
      include: { category: true },
    });

    const totalItems = await this.prismaService.product.count();

    return {
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(totalItems / limit),
      data: products.map((product) => {
        return Product.create({
          id: new ProductId(product.id),
          name: product.name,
          price: product.price,
          description: product.description,
          imageUrl: product.imageUrl,
          category: Category.create({
            id: new CategoryId(product.category.id),
            name: product.category.name,
            description: product.category.description,
          }),
        });
      }),
    };
  }
}
