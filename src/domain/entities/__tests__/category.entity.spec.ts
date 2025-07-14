import { Category, CategoryId } from '../category/category.entity';

describe('Unit Test Category Entity', () => {
  const input = {
    name: 'Category Test',
    description: 'Category Lorem ipsum',
  };

  it('should be create Category success', () => {
    const category = Category.create(input);

    expect(category.id).toBeInstanceOf(CategoryId);
    expect(category.name).toEqual(input.name);
    expect(category.description).toEqual(category.description);
  });

  it('should be create Category with CategoryId success', () => {
    const input = {
      id: new CategoryId(),
      name: 'Category Test',
      description: 'Category Lorem ipsum',
    };

    const category = Category.create(input);

    expect(category.id).toBeInstanceOf(CategoryId);
    expect(category.id).toEqual(input.id);
    expect(category.name).toEqual(input.name);
    expect(category.description).toEqual(category.description);
  });

  it('should be update name Category success', () => {
    const category = Category.create(input);
    const newName = 'new category';

    expect(category.name).toEqual(input.name);

    category.updateValues({ name: newName });

    expect(category.name).toEqual(newName);
  });

  it('should be update description Category success', () => {
    const category = Category.create(input);
    const newDescription = 'new decription';

    expect(category.name).toEqual(input.name);

    category.updateValues({ description: newDescription });

    expect(category.description).toEqual(newDescription);
  });

  it('should be update description and name Category success', () => {
    const category = Category.create(input);
    const newDescription = 'new decription';
    const newName = 'new category';

    expect(category.name).toEqual(input.name);
    expect(category.description).toEqual(input.description);

    category.updateValues({ name: newName, description: newDescription });

    expect(category.name).toEqual(newName);
    expect(category.description).toEqual(newDescription);
  });
});
