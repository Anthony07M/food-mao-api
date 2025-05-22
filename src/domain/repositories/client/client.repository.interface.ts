import { RepositoryInterface } from 'src/adapters/shared/repositories/repository.interface';
import { Client, ClientId } from 'src/domain/entities/client/client.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ClientRepositoryInterface
  extends RepositoryInterface<Client, ClientId> {}
