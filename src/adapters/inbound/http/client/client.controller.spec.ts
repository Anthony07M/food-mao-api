import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';
import { CreateClientUseCase } from 'src/application/use-cases/client/create-client.usecase';
import { GetAllClientsUseCase } from 'src/application/use-cases/client/get-all-clients.usecase';
import { GetClientByIdUseCase } from 'src/application/use-cases/client/get-client-by-id.usecase';
import { UpdateClientUseCase } from 'src/application/use-cases/client/update-client.usecase';
import { DeleteClientUseCase } from 'src/application/use-cases/client/delete-client.usecase';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client/client.repository.persistence';

describe('ClientController', () => {
  let controller: ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        PrismaService,
        {
          provide: 'ClientRepositoryInterface',
          useClass: ClientRepositoryPersistence,
        },
        CreateClientUseCase,
        GetAllClientsUseCase,
        GetClientByIdUseCase,
        UpdateClientUseCase,
        DeleteClientUseCase,
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});