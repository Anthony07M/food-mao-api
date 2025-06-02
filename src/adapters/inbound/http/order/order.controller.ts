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
  @ApiOperation({
    summary: 'Criar novo pedido',
    description:
      'Cria um novo pedido com base nos IDs dos produtos e quantidades fornecidas',
  })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
    schema: {
      example: {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        orderCode: 'ORD-1234567890',
        client: {
          id: 'client-uuid',
          name: 'João Silva',
          email: 'joao@email.com',
          cpf: '12345678901',
        },
        status: 'Pending',
        total: 38.4,
        paymentStatus: 'Pending',
        createdAt: '2023-12-01T10:30:00.000Z',
        preparationStarted: null,
        readyAt: null,
        completedAt: null,
        items: [
          {
            id: 'item-uuid',
            quantity: 2,
            notes: 'Pedido para entrega rápida',
            product: {
              id: 'b619076d-c198-435f-aa6f-7361d752a160',
              name: 'X-caboquinho',
              price: 19.2,
              description: 'x-caboquinho no pão',
              imageUrl: 'http://x-caboquinho.png',
              category: {
                id: '80ca9b53-3ab7-4f6a-a574-2c814766287c',
                name: 'Sanduiches',
                description: 'Sanduíches artesanais',
              },
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Produto ou cliente não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.createOrderUseCase.execute({
      items: createOrderDto.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      clientId: createOrderDto.clientId,
      notes: createOrderDto.notes,
    });
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
      paymentStatus: updateOrderDto.paymentStatus,
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
