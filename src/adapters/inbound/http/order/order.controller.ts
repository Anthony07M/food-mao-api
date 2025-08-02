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
  NotFoundException,
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
import { GetClientByIdUseCase } from 'src/application/use-cases/client/get-client-by-id.usecase';
import { FindProductByIdUseCase } from 'src/application/use-cases/product/findById.usecase';
import { Order, OrderId } from 'src/domain/entities/order/order.entity';
import { OrderItem } from 'src/domain/entities/order_item/order-item.entity';
import { FindOrdersActiveUseCase } from 'src/application/use-cases/order/find-orders-active.usecase';

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

  @Inject(GetClientByIdUseCase)
  private readonly getClientByIdUseCase: GetClientByIdUseCase;

  @Inject(FindProductByIdUseCase)
  private readonly findProductByIdUseCase: FindProductByIdUseCase;

  @Inject(FindOrdersActiveUseCase)
  private readonly findOrdersActiveUseCase: FindOrdersActiveUseCase;

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    const { clientId, items, notes } = createOrderDto;

    const client = clientId
      ? await this.getClientByIdUseCase.execute(clientId)
      : null;
    if (clientId && !client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const orderItems: OrderItem[] = [];
    const tempOrderId = new OrderId();

    for (const itemDto of items) {
      const productData = await this.findProductByIdUseCase.execute(
        itemDto.productId,
      );
      if (!productData) {
        throw new NotFoundException(
          `Product with ID ${itemDto.productId} not found`,
        );
      }

      const orderItem = OrderItem.create({
        orderId: tempOrderId,
        product: productData,
        quantity: itemDto.quantity,
      });

      orderItems.push(orderItem);
    }

    const order = Order.create({ client, items: orderItems, notes });
    return await this.createOrderUseCase.execute(order);
  }

  @Get()
  @ApiOperation({
    summary: 'List all orders',
    description: 'Returns a paginated list of all orders',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Orders list returned successfully',
  })
  async findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ) {
    const validLimit = Math.max(1, Math.min(limit || 10, 100));
    const validPage = Math.max(1, page || 1);
    const skip = (validPage - 1) * validLimit;

    return await this.getAllOrdersUseCase.execute(validLimit, skip);
  }

  @Get('/:orderId')
  @ApiOperation({
    summary: 'Find order by ID',
    description: 'Returns a specific order by its ID',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Order found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async findById(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    return await this.findByIdOrderUseCase.execute(orderId);
  }

  @Patch('/:orderId')
  @ApiOperation({
    summary: 'Update order',
    description: 'Updates an existing order',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
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
    summary: 'Delete order',
    description: 'Removes an order from the system',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 204,
    description: 'Order deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async remove(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    await this.deleteOrderUseCase.execute(orderId);
  }

  @Get('/list/actives')
  async getOrdersActive(
    @Query('limit', new ParseIntPipe()) limit: number,
    @Query('skip', new ParseIntPipe()) skip: number,
  ) {
    return await this.findOrdersActiveUseCase.execute(limit, skip);
  }
}
