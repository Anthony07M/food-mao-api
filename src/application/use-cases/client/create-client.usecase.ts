import { Injectable } from '@nestjs/common';
import { Client } from 'src/domain/entities/client/client.entity';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client/client.repository.persistence';

interface ICreateClientUseCase {
  name: string;
  email: string;
  cpf: string;
}

@Injectable()
export class CreateClientUseCase {
  constructor(
    private readonly clientRepositoryPersistence: ClientRepositoryPersistence,
  ) {}

  async execute(params: ICreateClientUseCase): Promise<Client> {
    const client = Client.create({
      name: params.name,
      email: params.email,
      cpf: params.cpf,
    });

    await this.clientRepositoryPersistence.save(client);
    return client;
  }
}
