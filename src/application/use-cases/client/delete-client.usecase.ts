import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientId } from 'src/domain/entities/client/client.entity';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client/client.repository.persistence';

@Injectable()
export class DeleteClientUseCase {
  constructor(
    @Inject('ClientRepositoryInterface')
    private readonly clientRepositoryPersistence: ClientRepositoryPersistence,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const clientId = new ClientId(id);

      const client = await this.clientRepositoryPersistence.findById(clientId);

      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }

      await this.clientRepositoryPersistence.remove(clientId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  }
}
