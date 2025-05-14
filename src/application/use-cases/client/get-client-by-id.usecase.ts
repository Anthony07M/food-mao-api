import { Injectable, NotFoundException } from '@nestjs/common';
import { Client, ClientId } from 'src/domain/entities/client/client.entity';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client.repository.persistence';

@Injectable()
export class GetClientByIdUseCase {
  constructor(
    private readonly clientRepositoryPersistence: ClientRepositoryPersistence,
  ) {}

  async execute(id: string): Promise<Client> {
    try {
      const clientId = new ClientId(id);
      const client = await this.clientRepositoryPersistence.findById(clientId);
      
      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      
      return client;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to get client: ${error.message}`);
    }
  }
}