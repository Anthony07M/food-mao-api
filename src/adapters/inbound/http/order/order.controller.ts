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
} from '@nestjs/common';
import { CreateOrderUseCase } from 'src/application/use-cases/order/create-order.usecase';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindByIdOrderUseCase } from 'src/application/use-cases/order/findById-order.usecase';
import { UpdateOrderUseCase } from 'src/application/use-cases/order/update-order.usecase';
import { DeleteOrderUseCase } from 'src/application/use-cases/order/delete-order.usecase';
import { GetAllOrdersUseCase } from 'src/application/use-cases/order/get-all-orders.usecase';

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
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.createOrderUseCase.execute({
      items: createOrderDto.items,
    });
  }

  @Get()
  async findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ) {
    return await this.getAllOrdersUseCase.execute(limit, page);
  }

  @Get('/:orderId')
  async findById(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    return await this.findByIdOrderUseCase.execute(orderId);
  }

  @Patch('/:orderId')
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
  async remove(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    await this.deleteOrderUseCase.execute(orderId);
    return { message: 'Order deleted successfully' };
  }
}
