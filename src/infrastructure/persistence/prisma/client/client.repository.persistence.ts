import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import { Client, ClientId } from 'src/domain/entities/client/client.entity';
import { ClientRepositoryInterface } from 'src/domain/repositories/client/client.repository.interface';
import { PaginatedResult } from 'src/adapters/shared/repositories/repository.interface';

@Injectable()
export class ClientRepositoryPersistence implements ClientRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async save(entity: Client): Promise<void> {
    await this.prismaService.client.create({
      data: {
        id: entity.id.toString(),
        name: entity.name,
        email: entity.email,
        cpf: entity.cpf,
        created_at: entity.createdAt,
      },
    });
  }

  async remove(entityId: ClientId): Promise<void> {
    await this.prismaService.client.delete({
      where: {
        id: entityId.toString(),
      },
    });
  }

  async update(entity: Client): Promise<void> {
    await this.prismaService.client.update({
      where: {
        id: entity.id.toString(),
      },
      data: {
        name: entity.name,
        email: entity.email,
        cpf: entity.cpf,
      },
    });
  }

  async findById(entityId: ClientId): Promise<Client | null> {
    const client = await this.prismaService.client.findUnique({
      where: {
        id: entityId.toString(),
      },
    });

    if (!client) {
      return null;
    }

    return Client.create({
      id: new ClientId(client.id),
      createdAt: client.created_at,
      name: client.name,
      email: client.email,
      cpf: client.cpf,
    });
  }

  async findAll(limit: number, skip: number): Promise<PaginatedResult<Client>> {
    const total = await this.prismaService.client.count();
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    const clients = await this.prismaService.client.findMany({
      skip,
      take: limit,
    });

    return {
      currentPage,
      totalPages,
      data: clients.map((client) =>
        Client.create({
          id: new ClientId(client.id),
          createdAt: client.created_at,
          name: client.name,
          email: client.email,
          cpf: client.cpf,
        }),
      ),
    };
  }
}
