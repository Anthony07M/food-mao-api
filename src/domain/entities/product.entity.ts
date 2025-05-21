import { Uuid } from 'src/adapters/shared/value-objects/uui.vo';
import { Category } from './category.entity';

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

  static create(params: ProductConstructorParams) {
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
