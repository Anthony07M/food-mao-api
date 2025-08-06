import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PaymentUseCase } from 'src/application/use-cases/payment/payment.usecase';
import { PaymentDto, WebHookDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  @Inject(PaymentUseCase)
  private readonly paymentUseCase: PaymentUseCase;

  @Post()
  async payment(@Body() paymentDto: PaymentDto) {
    return await this.paymentUseCase.payment(paymentDto.orderId);
  }

  @Post('webhook')
  async webhook(@Body() webHookDto: WebHookDto) {
    return await this.paymentUseCase.webhook(webHookDto);
  }
}
