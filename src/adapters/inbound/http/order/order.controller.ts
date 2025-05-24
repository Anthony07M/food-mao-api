import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateOrderUseCase } from 'src/application/use-cases/order/create-order.usecase';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindByIdOrderUseCase } from 'src/application/use-cases/order/findById-order.usecase';

@Controller('order')
export class OrderController {
  @Inject(CreateOrderUseCase)
  private readonly createOrderUseCase: CreateOrderUseCase;

  @Inject(FindByIdOrderUseCase)
  private readonly findByIdOrderUseCase: FindByIdOrderUseCase;

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.createOrderUseCase.execute({
      items: createOrderDto.items,
    });
  }

  @Get('/:orderId')
  async findById(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    return await this.findByIdOrderUseCase.execute(orderId);
  }
}
