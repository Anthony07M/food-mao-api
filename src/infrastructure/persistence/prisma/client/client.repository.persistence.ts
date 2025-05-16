import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  getPrismaWithClient,
} from 'src/infrastructure/config/prisma/prisma.service';
import { Client, ClientId } from 'src/domain/entities/client/client.entity';
import { ClientRepositoryInterface } from 'src/domain/repositories/client/client.repository.interface';
import { PaginatedResult } from 'src/adapters/shared/repositories/repository.interface';

@Injectable()
export class ClientRepositoryPersistence implements ClientRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async save(entity: Client): Promise<void> {
    // Use the type-safe helper
    const prisma = getPrismaWithClient(this.prismaService);

    await prisma.client.create({
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
    const prisma = getPrismaWithClient(this.prismaService);

    await prisma.client.delete({
      where: {
        id: entityId.toString(),
      },
    });
  }

  async update(entity: Client): Promise<void> {
    const prisma = getPrismaWithClient(this.prismaService);

    await prisma.client.update({
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
    const prisma = getPrismaWithClient(this.prismaService);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const client = await prisma.client.findUnique({
      where: {
        id: entityId.toString(),
      },
    });

    if (!client) {
      return null;
    }

    return Client.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      id: new ClientId(client.id),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      createdAt: client.created_at,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      name: client.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      email: client.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      cpf: client.cpf,
    });
  }

  async findAll(limit: number, skip: number): Promise<PaginatedResult<Client>> {
    const prisma = getPrismaWithClient(this.prismaService);

    const total = await prisma.client.count();
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    const clients = await prisma.client.findMany({
      skip,
      take: limit,
    });

    return {
      currentPage,
      totalPages,
      data: clients.map((client) =>
        Client.create({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
          id: new ClientId(client.id),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          createdAt: client.created_at,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          name: client.name,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          email: client.email,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          cpf: client.cpf,
        }),
      ),
    };
  }
}
