import {
  OrderItem,
  OrderItemConstructorParams,
  OrderItemId,
} from './../order_item/order-item.entity';

describe('OrderItem Entity', () => {
  it('should create OrderItem successfully', () => {
    const params: OrderItemConstructorParams = {
      orderId: 'order-123',
      productId: 'product-456',
      quantity: 2,
      notes: 'Extra sauce',
    };

    const orderItem = OrderItem.create(params);

    expect(orderItem).toBeInstanceOf(OrderItem);
    expect(orderItem.id).toBeInstanceOf(OrderItemId);
    expect(orderItem.orderId).toEqual('order-123');
    expect(orderItem.productId).toEqual('product-456');
    expect(orderItem.quantity).toEqual(2);
    expect(orderItem.notes).toEqual('Extra sauce');
  });

  it('should create OrderItem without notes', () => {
    const params: OrderItemConstructorParams = {
      orderId: 'order-123',
      productId: 'product-456',
      quantity: 1,
    };

    const orderItem = OrderItem.create(params);

    expect(orderItem).toBeInstanceOf(OrderItem);
    expect(orderItem.notes).toBeNull();
  });

  it('should throw error for invalid UUID', () => {
    void expect(() => {
      new OrderItemId('1234');
    }).toThrow('ID must be a valid UUID');
  });
});