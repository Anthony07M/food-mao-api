import { Category } from '../category/category.entity';
import { Product, ProductId } from '../product/product.entity';

describe('Unit test Product Entity', () => {
  it('should be create product success', () => {
    const input = {
      name: 'Product Test',
      category: Category.create({ name: 'C1', description: 'C1 lorem' }),
      description: 'Lorem ipsum',
      imageUrl: 'http://test.com',
      price: 123.44,
    };
    const product = Product.create(input);

    expect(product).toBeInstanceOf(Product);
    expect(product.id).toBeInstanceOf(ProductId);
    expect(product.category).toBeInstanceOf(Category);

    expect(product.category.name).toEqual(input.category.name);
    expect(product.category.description).toEqual(input.category.description);

    expect(product.name).toEqual(input.name);
    expect(product.description).toEqual(input.description);
    expect(product.imageUrl).toEqual(input.imageUrl);
    expect(product.price).toEqual(input.price);
  });

  it('should be update all values success', () => {
    const newValues = {
      name: 'new Product',
      category: Category.create({ name: 'C2', description: 'C2 new' }),
      description: 'new lorem',
      imageUrl: 'http://test2.com',
      price: 223.44,
    };

    const product = Product.create({
      name: 'Product Test',
      category: Category.create({ name: 'C1', description: 'C1 lorem' }),
      description: 'Lorem ipsum',
      imageUrl: 'http://test.com',
      price: 123.44,
    });

    product.updateValues(newValues);

    expect(product).toBeInstanceOf(Product);
    expect(product.id).toBeInstanceOf(ProductId);
    expect(product.category).toBeInstanceOf(Category);

    expect(product.category.name).toEqual(newValues.category.name);
    expect(product.category.description).toEqual(
      newValues.category.description,
    );

    expect(product.name).toEqual(newValues.name);
    expect(product.description).toEqual(newValues.description);
    expect(product.imageUrl).toEqual(newValues.imageUrl);
    expect(product.price).toEqual(newValues.price);
  });

  it('should be called function updateValues()', () => {
    const newValues = {
      name: 'new Product',
      category: Category.create({ name: 'C2', description: 'C2 new' }),
      description: 'new lorem',
      imageUrl: 'http://test2.com',
      price: 223.44,
    };

    const product = Product.create({
      name: 'Product Test',
      category: Category.create({ name: 'C1', description: 'C1 lorem' }),
      description: 'Lorem ipsum',
      imageUrl: 'http://test.com',
      price: 123.44,
    });

    const updateValuesSpy = jest.spyOn(product, 'updateValues');

    product.updateValues(newValues);

    expect(updateValuesSpy).toHaveBeenCalledWith(newValues);
  });
});
