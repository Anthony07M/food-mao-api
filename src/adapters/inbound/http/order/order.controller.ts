import { Controller, Inject, Post } from '@nestjs/common';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';

@Controller('order')
export class OrderController {
  @Inject(CreateOrderUseCase)
  private readonly createOrderUseCase: CreateOrderUseCase;

  @Post()
  create() {
    return this.createOrderUseCase.execute({ total: 1 });
  }
}
