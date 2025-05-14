import { Order, OrderConstructrorParams, OrderId } from '../order/order.entity';

describe('Unit test s', () => {
  it('should be create Order success', () => {
    const params: OrderConstructrorParams = {
      valueTotal: 10,
    };

    const order = Order.create(params);

    expect(order).toBeInstanceOf(Order);
    expect(order.id).toBeInstanceOf(OrderId);
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.valueTotal).toEqual(10);
  });

  it('should be throw error UUID invalid ', () => {
    void expect(() => {
      new OrderId('1234');
    }).toThrow('ID must be a valid UUID');
  });
});
