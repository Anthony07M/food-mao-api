import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Inject, 
  Param, 
  ParseIntPipe, 
  Patch, 
  Post, 
  Query 
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientUseCase } from '../../../application/use-cases/client/create-client.usecase';
import { GetAllClientsUseCase } from '../../../application/use-cases/client/get-all-clients.usecase';
import { GetClientByIdUseCase } from '../../../application/use-cases/client/get-client-by-id.usecase';
import { UpdateClientUseCase } from '../../../application/use-cases/client/update-client.usecase';
import { DeleteClientUseCase } from '../../../application/use-cases/client/delete-client.usecase';

@Controller('clients')
export class ClientController {
  @Inject(CreateClientUseCase)
  private readonly createClientUseCase: CreateClientUseCase;

  @Inject(GetAllClientsUseCase)
  private readonly getAllClientsUseCase: GetAllClientsUseCase;

  @Inject(GetClientByIdUseCase)
  private readonly getClientByIdUseCase: GetClientByIdUseCase;

  @Inject(UpdateClientUseCase)
  private readonly updateClientUseCase: UpdateClientUseCase;

  @Inject(DeleteClientUseCase)
  private readonly deleteClientUseCase: DeleteClientUseCase;

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.createClientUseCase.execute(createClientDto);
  }

  @Get()
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ) {
    return this.getAllClientsUseCase.execute(limit, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getClientByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.updateClientUseCase.execute({
      id,
      ...updateClientDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteClientUseCase.execute(id);
  }
}