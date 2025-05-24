import { Uuid } from 'src/adapters/shared/value-objects/uui.vo';
import { Product } from '../product.entity';
import { OrderId } from '../order/order.entity';

export class OrderItemId extends Uuid {}

export interface OrderItemConstructorParams {
  id?: OrderItemId;
  orderId: OrderId;
  product: Product;
  quantity: number;
  notes?: string | null;
}

export class OrderItem {
  id: OrderItemId;
  orderId: OrderId;
  productId: string;
  product: Product;
  quantity: number;
  notes: string | null;

  constructor(params: OrderItemConstructorParams) {
    this.id = params.id ?? new OrderItemId();
    this.orderId = params.orderId;
    this.quantity = params.quantity;
    this.notes = params.notes ?? null;
    this.product = params.product;
  }

  static create(params: OrderItemConstructorParams): OrderItem {
    return new OrderItem(params);
  }
}
