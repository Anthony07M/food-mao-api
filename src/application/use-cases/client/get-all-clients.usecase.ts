import { Injectable } from '@nestjs/common';
import { Client } from 'src/domain/entities/client/client.entity';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client.repository.persistence';

interface GetAllClientsResponse {
  currentPage: number;
  totalPages: number;
  data: Client[];
}

@Injectable()
export class GetAllClientsUseCase {
  constructor(
    private readonly clientRepositoryPersistence: ClientRepositoryPersistence,
  ) {}

  async execute(limit: number = 10, page: number = 1): Promise<GetAllClientsResponse> {
    // Calculate the number of items to skip
    const skip = (page - 1) * limit;
    
    return this.clientRepositoryPersistence.findAll(limit, skip);
  }
}