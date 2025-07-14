import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientUseCase } from 'src/application/use-cases/client/create-client.usecase';
import {
  GetAllClientsUseCase,
  GetAllClientsResponse,
} from 'src/application/use-cases/client/get-all-clients.usecase';
import { GetClientByIdUseCase } from 'src/application/use-cases/client/get-client-by-id.usecase';
import { UpdateClientUseCase } from 'src/application/use-cases/client/update-client.usecase';
import { DeleteClientUseCase } from 'src/application/use-cases/client/delete-client.usecase';
import { Client } from 'src/domain/entities/client/client.entity';

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
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientDto: CreateClientDto) {
    try {
      const client = Client.create(createClientDto);
      return this.createClientUseCase.execute(client);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 100,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ): Promise<GetAllClientsResponse> {
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
