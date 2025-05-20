import { Uuid } from 'src/adapters/shared/value-objects/uui.vo';

export interface CategoryConstructorParams {
  id?: CategoryId;
  name: string;
  description: string;
}

export class CategoryId extends Uuid {}

export class Category {
  id: CategoryId;
  name: string;
  description: string;

  constructor(params: CategoryConstructorParams) {
    this.id = params.id ?? new CategoryId();
    this.name = params.name;
    this.description = params.description;
  }

  static create(params: CategoryConstructorParams) {
    return new Category(params);
  }

  updateValues(params: { name?: string; description?: string }) {
    const { name, description } = params;
    this.name = name ?? this.name;
    this.description = description ?? this.description;
  }
}
