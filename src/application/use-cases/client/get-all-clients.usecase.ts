import { Injectable } from '@nestjs/common';
import { PaginatedResult } from 'src/adapters/shared/repositories/repository.interface';
import { Client } from 'src/domain/entities/client/client.entity';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client/client.repository.persistence';

// Export this as the response type for the controller to use
export type GetAllClientsResponse = PaginatedResult<Client>;

@Injectable()
export class GetAllClientsUseCase {
  constructor(
    private readonly clientRepositoryPersistence: ClientRepositoryPersistence,
  ) {}

  async execute(
    limit: number = 10,
    page: number = 1,
  ): Promise<GetAllClientsResponse> {
    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    return this.clientRepositoryPersistence.findAll(limit, skip);
  }
}
