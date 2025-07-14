import { Uuid } from 'src/adapters/shared/value-objects/uui.vo';

export class ClientId extends Uuid {}

export interface ClientConstructorParams {
  id?: ClientId;
  createdAt?: Date;
  name: string;
  email: string;
  cpf: string;
}

export class Client {
  id: ClientId;
  createdAt: Date;
  name: string;
  email: string;
  cpf: string;

  constructor(params: ClientConstructorParams) {
    this.id = params.id ?? new ClientId();
    this.createdAt = params.createdAt ?? new Date();
    this.name = params.name;
    this.email = params.email;
    this.cpf = params.cpf;
  }

  static create(params: Omit<ClientConstructorParams, 'id' | 'createdAt'>): Client {
    if (!params.name || params.name.trim().length < 3) {
      throw new Error('Client name must be at least 3 characters long.');
    }
    if (!params.email || !/\S+@\S+\.\S+/.test(params.email)) {
      throw new Error('Invalid email format for client.');
    }
    if (!params.cpf || !/^\d{11}$/.test(params.cpf.replace(/\D/g, ''))) {
      throw new Error('Invalid CPF format for client. Must contain 11 digits.');
    }

    return new Client({
      ...params,
      cpf: params.cpf.replace(/\D/g, ''), // Store only digits
    });
  }
}
