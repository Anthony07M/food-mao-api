import { Uuid } from 'src/adapters/shared/value-objects/uui.vo';
import { Product } from '../product/product.entity';
import { OrderId } from '../order/order.entity';

export class OrderItemId extends Uuid {}

export interface OrderItemConstructorParams {
  id?: OrderItemId;
  orderId: OrderId;
  product: Product;
  quantity: number;
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
    this.product = params.product;
  }

  static create(params: Omit<OrderItemConstructorParams, 'id'>): OrderItem {
    if (!params.product) {
      throw new Error('OrderItem must have a product.');
    }
    if (params.quantity == null || params.quantity <= 0) {
      throw new Error('OrderItem quantity must be a positive number.');
    }
    return new OrderItem(params);
  }
}
