import { Uuid } from 'src/adapters/shared/value-objects/uui.vo';
import { Client } from '../client/client.entity';
import { randomUUID } from 'node:crypto';
import { OrderItem, OrderItemId } from '../order_item/order-item.entity';
import { BadRequestException } from '@nestjs/common';

export class OrderId extends Uuid {}
export type StatusOrder =
  | 'Pending'
  | 'Concluded'
  | 'Canceled'
  | 'In_Progress'
  | 'Confirmed'
  | 'Rejected'
  | 'Received'
  | 'Ready'
  | 'Concluded_not_received';

export type StatusPayment =
  | 'Pending'
  | 'Canceled'
  | 'GeneratedQRCode'
  | 'Concluded';

export interface OrderConstructrorParams {
  id?: OrderId;
  orderCode?: string;
  client?: Client | null;
  status?: StatusOrder;
  total?: number;
  paymentId?: string | null;
  notes?: string | null;
  paymentStatus?: StatusPayment;
  createdAt?: Date;
  preparationStarted?: Date | null;
  readyAt?: Date | null;
  completedAt?: Date | null;
  items: OrderItem[];
}

export class Order {
  id: OrderId;
  orderCode: string;
  client: Client | null;
  status: StatusOrder;
  total: number;
  paymentId: string | null;
  notes?: string | null;
  paymentStatus: StatusPayment;
  createdAt: Date;
  preparationStarted: Date | null;
  readyAt: Date | null;
  completedAt: Date | null;
  items: OrderItem[];

  constructor(params: OrderConstructrorParams) {
    this.id = params.id ?? new OrderId();
    this.orderCode = params.orderCode ?? `ORD-${randomUUID().slice(0, 10)}`;
    this.client = params.client ?? null;
    this.status = params.status ?? 'Pending';
    this.total = params.total ?? 0;
    this.paymentId = params.paymentId ?? null;
    this.notes = params.notes ?? null;
    this.paymentStatus = params.paymentStatus ?? 'Pending';
    this.createdAt = params.createdAt ?? new Date();
    this.preparationStarted = params.preparationStarted ?? null;
    this.readyAt = params.readyAt ?? null;
    this.completedAt = params.completedAt ?? null;
    this.items = params.items;
  }

  static create(params: Omit<OrderConstructrorParams, 'id' | 'orderCode' | 'status' | 'total' | 'paymentStatus' | 'createdAt'>): Order {
    if (!params.items || params.items.length === 0) {
      throw new Error('Order must have at least one item.');
    }

    const order = new Order(params);
    order.calculateTotal();
    return order;
  }

  calculateTotal(): number {
    const total = this.items.reduce((acc, current) => {
      return current.quantity * current.product.price + acc;
    }, 0);

    this.total = total;

    return total;
  }

  addItem(item: OrderItem) {
    this.items.push(item);
  }

  removeItem(itemId: OrderItemId) {
    this.items = [
      ...this.items.filter((item) => item.id.toString() !== itemId.toString()),
    ];
  }

  initPreparation() {
    if (this.paymentStatus !== 'Concluded') {
      throw new BadRequestException('Payment status must be concluded');
    }

    this.preparationStarted = new Date();
    this.status = 'In_Progress';
  }

  confirmOrder() {
    this.status = 'Confirmed';
  }

  receivedOrder() {
    if (this.paymentStatus !== 'Concluded') {
      throw new BadRequestException('Payment status must be Concluded');
    }

    if (this.status === 'Confirmed') {
      this.status = 'Received';
    }

    if (
      (this.status === 'Pending' ||
        this.status === 'Canceled' ||
        this.status === 'Concluded' ||
        this.status === 'Concluded_not_received' ||
        this.status === 'In_Progress',
      this.status === 'Ready')
    ) {
      throw new BadRequestException('Order status must be Pending');
    }
  }

  finalizyPreparation() {
    if (this.status !== 'In_Progress') {
      throw new BadRequestException(
        'Order must be "In_Progress" to be marked as ready.',
      );
    }

    if (this.readyAt !== null) {
      throw new BadRequestException('Order has already been marked as ready.');
    }

    this.status = 'Ready';
    this.readyAt = new Date();
    this.completedAt = new Date();
  }

  concludedOrder() {
    if (this.paymentStatus !== 'Concluded') {
      throw new BadRequestException('Payment status must be Concluded');
    }

    if (
      this.status === 'Concluded' ||
      this.status === 'Concluded_not_received'
    ) {
      throw new BadRequestException('Order has already been concluded');
    }

    if (this.status === 'Ready') {
      this.status = 'Concluded';
    } else {
      throw new BadRequestException('Order status must be Ready');
    }
  }
}
