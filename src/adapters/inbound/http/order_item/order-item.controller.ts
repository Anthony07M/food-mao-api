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
  Query,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { CreateOrderItemUseCase } from 'src/application/use-cases/order_item/create-order-item.usecase';
import { GetAllOrderItemsUseCase } from 'src/application/use-cases/order_item/get-all-order-items.usecase';
import { GetOrderItemByIdUseCase } from 'src/application/use-cases/order_item/get-order-item-by-id.usecase';
import { GetOrderItemsByOrderUseCase } from 'src/application/use-cases/order_item/get-order-items-by-order.usecase';
import { UpdateOrderItemUseCase } from 'src/application/use-cases/order_item/update-order-item.usecase';
import { DeleteOrderItemUseCase } from 'src/application/use-cases/order_item/delete-order-item.usecase';

@Controller('order-items')
export class OrderItemController {
  @Inject(CreateOrderItemUseCase)
  private readonly createOrderItemUseCase: CreateOrderItemUseCase;

  @Inject(GetAllOrderItemsUseCase)
  private readonly getAllOrderItemsUseCase: GetAllOrderItemsUseCase;

  @Inject(GetOrderItemByIdUseCase)
  private readonly getOrderItemByIdUseCase: GetOrderItemByIdUseCase;

  @Inject(GetOrderItemsByOrderUseCase)
  private readonly getOrderItemsByOrderUseCase: GetOrderItemsByOrderUseCase;

  @Inject(UpdateOrderItemUseCase)
  private readonly updateOrderItemUseCase: UpdateOrderItemUseCase;

  @Inject(DeleteOrderItemUseCase)
  private readonly deleteOrderItemUseCase: DeleteOrderItemUseCase;

  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.createOrderItemUseCase.execute(createOrderItemDto);
  }

  @Get()
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ) {
    return this.getAllOrderItemsUseCase.execute(limit, page);
  }

  @Get('by-order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.getOrderItemsByOrderUseCase.execute(orderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getOrderItemByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.updateOrderItemUseCase.execute({
      id,
      ...updateOrderItemDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteOrderItemUseCase.execute(id);
  }
}
