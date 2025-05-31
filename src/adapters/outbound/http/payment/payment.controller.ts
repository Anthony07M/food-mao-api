import { Param, Controller, Inject, Get, ParseUUIDPipe } from '@nestjs/common';
import { PaymentUseCase } from 'src/application/use-cases/payment/payment.usecase';

@Controller('payment')
export class PaymentController {
  @Inject(PaymentUseCase)
  private readonly paymentUseCase: PaymentUseCase;

  @Get('/:orderId')
  async payment(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    return await this.paymentUseCase.payment(orderId);
  }
}
