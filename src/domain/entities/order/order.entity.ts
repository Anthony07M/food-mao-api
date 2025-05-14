import { Uuid } from 'src/adapters/shared/value-objects/uui.vo';

export class OrderId extends Uuid {}

export interface OrderConstructrorParams {
  id?: OrderId;
  createdAt?: Date;
  valueTotal: number | null;
}

export class Order {
  id: OrderId;
  createdAt: Date;
  valueTotal: number | null;

  constructor(params: OrderConstructrorParams) {
    this.id = params.id ?? new OrderId();
    this.createdAt = params.createdAt ?? new Date();
    this.valueTotal = params.valueTotal ?? null;
  }

  static create(params: OrderConstructrorParams): Order {
    return new Order(params);
  }
}
