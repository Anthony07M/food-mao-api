import { Uuid } from 'src/adapters/shared/value-objects/uui.vo';

export class OrderItemId extends Uuid {}

export interface OrderItemConstructorParams {
  id?: OrderItemId;
  orderId: string;
  productId: string;
  quantity: number;
  notes?: string | null;
}

export class OrderItem {
  id: OrderItemId;
  orderId: string;
  productId: string;
  quantity: number;
  notes: string | null;

  constructor(params: OrderItemConstructorParams) {
    this.id = params.id ?? new OrderItemId();
    this.orderId = params.orderId;
    this.productId = params.productId;
    this.quantity = params.quantity;
    this.notes = params.notes ?? null;
  }

  static create(params: OrderItemConstructorParams): OrderItem {
    return new OrderItem(params);
  }
}