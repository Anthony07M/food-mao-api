import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateOrderUseCase } from 'src/application/use-cases/order/create-order.usecase';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindByIdOrderUseCase } from 'src/application/use-cases/order/findById-order.usecase';
import { UpdateOrderUseCase } from 'src/application/use-cases/order/update-order.usecase';
import { DeleteOrderUseCase } from 'src/application/use-cases/order/delete-order.usecase';
import { GetAllOrdersUseCase } from 'src/application/use-cases/order/get-all-orders.usecase';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  @Inject(CreateOrderUseCase)
  private readonly createOrderUseCase: CreateOrderUseCase;

  @Inject(FindByIdOrderUseCase)
  private readonly findByIdOrderUseCase: FindByIdOrderUseCase;

  @Inject(UpdateOrderUseCase)
  private readonly updateOrderUseCase: UpdateOrderUseCase;

  @Inject(DeleteOrderUseCase)
  private readonly deleteOrderUseCase: DeleteOrderUseCase;

  @Inject(GetAllOrdersUseCase)
  private readonly getAllOrdersUseCase: GetAllOrdersUseCase;

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.createOrderUseCase.execute(createOrderDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os pedidos',
    description: 'Retorna uma lista paginada de todos os pedidos',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página (padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página (padrão: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso',
  })
  async findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ) {
    const validLimit = Math.max(1, Math.min(limit || 10, 100)); // Entre 1 e 100
    const validPage = Math.max(1, page || 1); // Mínimo 1
    const skip = (validPage - 1) * validLimit; // Sempre >= 0

    return await this.getAllOrdersUseCase.execute(validLimit, skip);
  }

  @Get('/:orderId')
  @ApiOperation({
    summary: 'Buscar pedido por ID',
    description: 'Retorna um pedido específico pelo seu ID',
  })
  @ApiParam({
    name: 'orderId',
    description: 'ID do pedido',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  async findById(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    return await this.findByIdOrderUseCase.execute(orderId);
  }

  @Patch('/:orderId')
  @ApiOperation({
    summary: 'Atualizar pedido',
    description: 'Atualiza um pedido existente',
  })
  @ApiParam({
    name: 'orderId',
    description: 'ID do pedido',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  async update(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.updateOrderUseCase.execute({
      id: orderId,
      status: updateOrderDto.status,
    });
  }

  @Delete('/:orderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar pedido',
    description: 'Remove um pedido do sistema',
  })
  @ApiParam({
    name: 'orderId',
    description: 'ID do pedido',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 204,
    description: 'Pedido deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  async remove(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    await this.deleteOrderUseCase.execute(orderId);
  }
}
