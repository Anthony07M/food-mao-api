import { Injectable, NotFoundException } from '@nestjs/common';
import { Client, ClientId } from 'src/domain/entities/client/client.entity';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client.repository.persistence';

interface IUpdateClientUseCaseParams {
  id: string;
  name?: string;
  email?: string;
  cpf?: string;
}

@Injectable()
export class UpdateClientUseCase {
  constructor(
    private readonly clientRepositoryPersistence: ClientRepositoryPersistence,
  ) {}

  async execute(params: IUpdateClientUseCaseParams): Promise<Client> {
    try {
      const clientId = new ClientId(params.id);
      const client = await this.clientRepositoryPersistence.findById(clientId);
      
      if (!client) {
        throw new NotFoundException(`Client with ID ${params.id} not found`);
      }
      
      // Update only provided fields
      if (params.name) client.name = params.name;
      if (params.email) client.email = params.email;
      if (params.cpf) client.cpf = params.cpf;
      
      await this.clientRepositoryPersistence.update(client);
      return client;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update client: ${error.message}`);
    }
  }
}