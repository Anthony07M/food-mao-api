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

  static create(params: ClientConstructorParams): Client {
    return new Client(params);
  }
}
