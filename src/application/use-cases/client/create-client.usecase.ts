import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'src/domain/entities/client/client.entity';
import { ClientRepositoryInterface } from 'src/domain/repositories/client/client.repository.interface';

interface ICreateClientUseCase {
  name: string;
  email: string;
  cpf: string;
}

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject('ClientRepositoryInterface')
    private readonly clientRepository: ClientRepositoryInterface,
  ) {}

  async execute(client: Client): Promise<Client> {
    return this.clientRepository.save(client);
  }
}
