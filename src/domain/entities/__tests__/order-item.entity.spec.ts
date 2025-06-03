import { Category } from '../category.entity';
import { OrderId } from '../order/order.entity';
import { Product } from '../product.entity';
import {
  OrderItem,
  OrderItemConstructorParams,
  OrderItemId,
} from './../order_item/order-item.entity';

describe('OrderItem Entity', () => {
  it('should create OrderItem successfully', () => {
    const product = Product.create({
      name: 'Product Test',
      category: Category.create({ name: 'C1', description: 'C1 lorem' }),
      description: 'Lorem ipsum',
      imageUrl: 'http://test.com',
      price: 123.44,
    });

    const params: OrderItemConstructorParams = {
      orderId: new OrderId(),
      product,
      quantity: 2,
    };

    const orderItem = OrderItem.create(params);

    expect(orderItem).toBeInstanceOf(OrderItem);
    expect(orderItem.orderId).toBeInstanceOf(OrderId);
    expect(orderItem.product).toBeInstanceOf(Product);
    expect(orderItem.id).toBeInstanceOf(OrderItemId);
    expect(orderItem.product).toEqual(product);
    expect(orderItem.quantity).toEqual(2);
  });

  it('should throw error for invalid UUID', () => {
    void expect(() => {
      new OrderItemId('1234');
    }).toThrow('ID must be a valid UUID');
  });
});
