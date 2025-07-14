import { Uuid } from 'src/adapters/shared/value-objects/uui.vo';
import { Category } from '../category/category.entity';

export class ProductId extends Uuid {}

export interface ProductConstructorParams {
  id?: ProductId;
  name: string;
  category: Category;
  price: number;
  description: string;
  imageUrl: string;
}

export type IUpdateProductValues = Partial<
  Omit<ProductConstructorParams, 'id'>
>;

export class Product {
  id: ProductId;
  name: string;
  category: Category;
  price: number;
  description: string;
  imageUrl: string;

  constructor(params: ProductConstructorParams) {
    this.id = params.id ?? new ProductId();
    this.name = params.name;
    this.category = params.category;
    this.price = params.price;
    this.description = params.description;
    this.imageUrl = params.imageUrl;
  }

  static create(params: Omit<ProductConstructorParams, 'id'>) {
    if (!params.name || params.name.trim().length < 3) {
      throw new Error('Product name must be at least 3 characters long.');
    }
    if (!params.description || params.description.trim().length < 5) {
      throw new Error('Product description must be at least 5 characters long.');
    }
    if (params.price === null || params.price === undefined || params.price <= 0) {
      throw new Error('Price must be a positive number.');
    }
    if (!params.category) {
      throw new Error('Product must have a category.');
    }
    // Basic URL validation
    if (!params.imageUrl || !/^https?:\/\/.+\..+/.test(params.imageUrl)) {
      throw new Error('Invalid image URL format for product.');
    }

    return new Product(params);
  }

  updateValues(params: IUpdateProductValues) {
    this.name = params.name ?? this.name;
    this.category = params.category ?? this.category;
    this.price = params.price ?? this.price;
    this.description = params.description ?? this.description;
    this.imageUrl = params.imageUrl ?? this.imageUrl;
  }
}
