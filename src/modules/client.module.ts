import { Module } from '@nestjs/common';
import { ClientController } from 'src/adapters/inbound/http/client/client.controller';
import { CreateClientUseCase } from 'src/application/use-cases/client/create-client.usecase';
import { GetAllClientsUseCase } from 'src/application/use-cases/client/get-all-clients.usecase';
import { GetClientByIdUseCase } from 'src/application/use-cases/client/get-client-by-id.usecase';
import { UpdateClientUseCase } from 'src/application/use-cases/client/update-client.usecase';
import { DeleteClientUseCase } from 'src/application/use-cases/client/delete-client.usecase';
import { ClientRepositoryPersistence } from 'src/infrastructure/persistence/prisma/client/client.repository.persistence';
import { PrismaService } from 'src/infrastructure/config/prisma/prisma.service';

@Module({
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
  exports: [
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
})
export class ClientModule {}
