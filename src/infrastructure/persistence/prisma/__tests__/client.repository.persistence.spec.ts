import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../config/prisma/prisma.service';
import { ClientRepositoryPersistence } from '../client/client.repository.persistence';
import {
  Client,
  ClientId,
} from '../../../../domain/entities/client/client.entity';

describe('ClientRepositoryPersistence', () => {
  let repository: ClientRepositoryPersistence;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientRepositoryPersistence,
        {
          provide: PrismaService,
          useValue: {
            client: {
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<ClientRepositoryPersistence>(
      ClientRepositoryPersistence,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a client successfully', async () => {
      const client = Client.create({
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678900',
      });

      await repository.save(client);

      expect(prismaService.client.create).toHaveBeenCalledWith({
        data: {
          id: client.id.toString(),
          name: client.name,
          email: client.email,
          cpf: client.cpf,
          created_at: client.createdAt,
        },
      });
    });
  });

  describe('findById', () => {
    it('should return a client when found', async () => {
      const clientId = new ClientId();
      const mockClientData = {
        id: clientId.toString(),
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678900',
        created_at: new Date(),
      };

      jest
        .spyOn(prismaService.client, 'findUnique')
        .mockResolvedValue(mockClientData);

      const result = await repository.findById(clientId);

      expect(result).toBeInstanceOf(Client);
      expect(result?.id.toString()).toEqual(clientId.toString());
      expect(result?.name).toEqual(mockClientData.name);
      expect(result?.email).toEqual(mockClientData.email);
      expect(result?.cpf).toEqual(mockClientData.cpf);
    });

    it('should return null when client is not found', async () => {
      const clientId = new ClientId();

      jest.spyOn(prismaService.client, 'findUnique').mockResolvedValue(null);

      const result = await repository.findById(clientId);

      expect(result).toBeNull();
    });
  });

  // Additional tests for update, remove, and findAll can be added here
});
