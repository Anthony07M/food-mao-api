import { Injectable } from '@nestjs/common';
import { PaginatedResult } from 'src/adapters/shared/repositories/repository.interface';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client/client.repository.persistence';

export type GetAllClientsResponse = PaginatedResult<{
  id: string;
  name: string;
  email: string;
  cpf: string;
}>;

@Injectable()
export class GetAllClientsUseCase {
  constructor(
    private readonly clientRepositoryPersistence: ClientRepositoryPersistence,
  ) {}

  async execute(
    limit: number = 100,
    page: number = 1,
  ): Promise<GetAllClientsResponse> {
    const { currentPage, data, totalPages } =
      await this.clientRepositoryPersistence.findAll(limit, page);

    return {
      currentPage,
      totalPages,
      data: data.map(({ id, ...client }) => ({ id: id.toString(), ...client })),
    };
  }
}
