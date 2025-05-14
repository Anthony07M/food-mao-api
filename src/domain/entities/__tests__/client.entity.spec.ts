import { Client, ClientConstructorParams, ClientId } from '../client/client.entity';

describe('Client Entity', () => {
  it('should create Client successfully', () => {
    const params: ClientConstructorParams = {
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '12345678900',
    };

    const client = Client.create(params);

    expect(client).toBeInstanceOf(Client);
    expect(client.id).toBeInstanceOf(ClientId);
    expect(client.createdAt).toBeInstanceOf(Date);
    expect(client.name).toEqual('John Doe');
    expect(client.email).toEqual('john@example.com');
    expect(client.cpf).toEqual('12345678900');
  });

  it('should throw error for invalid UUID', () => {
    void expect(() => {
      new ClientId('1234');
    }).toThrow('ID must be a valid UUID');
  });
});