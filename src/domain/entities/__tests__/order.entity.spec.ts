import { Category } from '../category/category.entity';
import { Order, OrderId } from '../order/order.entity';
import { OrderItem } from '../order_item/order-item.entity';
import { Product } from '../product/product.entity';

describe('Unit test s', () => {
  let products: Product[];

  beforeEach(() => {
    products = [
      Product.create({
        name: 'R7 7800x3d',
        category: Category.create({
          name: 'cpus',
          description: 'Processadores de alta performance',
        }),
        description: 'Processador Ryzen 7 7800x3d',
        price: 2599.66,
        imageUrl: 'http://processador.png',
      }),
      Product.create({
        name: 'RTX 5090',
        category: Category.create({
          name: 'gpus',
          description: 'Placas de vídeo high end',
        }),
        description: 'Geforce RTX 5090 32GB DDR7',
        price: 12685.66,
        imageUrl: 'http://placadevideo.png',
      }),
    ];
  });

  it('should be create Order success', () => {
    const product = Product.create({
      name: 'Product Test',
      category: Category.create({ name: 'C1', description: 'C1 lorem' }),
      description: 'Lorem ipsum',
      imageUrl: 'http://test.com',
      price: 123.44,
    });

    const orderItem = OrderItem.create({
      product,
      quantity: 2,
      orderId: new OrderId(),
    });

    const order = Order.create({
      items: [orderItem],
    });

    order.calculateTotal();

    expect(order).toBeInstanceOf(Order);
    expect(order.id).toBeInstanceOf(OrderId);
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.total).toEqual(246.88);
  });

  it('should be set status Read', () => {
    const product = Product.create({
      name: 'Product Test',
      category: Category.create({ name: 'C1', description: 'C1 lorem' }),
      description: 'Lorem ipsum',
      imageUrl: 'http://test.com',
      price: 123.44,
    });

    const orderItem = OrderItem.create({
      product,
      quantity: 2,
      orderId: new OrderId(),
    });

    const order = Order.create({
      items: [orderItem],
    });

    order.status = 'In_Progress';

    expect(order.status).toEqual('In_Progress');
    expect(order.readyAt).toBeNull();

    order.finalizyPreparation();

    expect(order.status).toEqual('Ready');
    expect(order.readyAt).toBeInstanceOf(Date);
  });

  it('should be throw error UUID invalid ', () => {
    void expect(() => {
      new OrderId('1234');
    }).toThrow('ID must be a valid UUID');
  });
});
