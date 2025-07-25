import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';

import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';
import { OrderId } from 'src/domain/entities/order/order.entity';
import { PaymentRepositoryPersistence } from 'src/infrastructure/persistence/mercadoPago/payment.repository.persistence';
import { CreatePayment } from 'src/adapters/shared/repositories/payment.interface';

@Injectable()
export class PaymentUseCase {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
    @Inject('PaymentRepositoryInterface')
    private readonly paymentRepositoryPersistence: PaymentRepositoryPersistence,
  ) {}

  async payment(orderId: string) {
    const order = await this.orderRepositoryPersistence.findById(
      new OrderId(orderId),
    );

    if (!order) throw new NotFoundException('Order not found');

    if (order.paymentStatus !== 'Pending')
      throw new BadRequestException('Payment has already been in progress');

    const dateOfExpiration = new Date();
    dateOfExpiration.setMinutes(dateOfExpiration.getMinutes() + 6);

    const body: CreatePayment = {
      transactionAmount: order.total,
      dateOfExpiration: dateOfExpiration.toISOString(),
      paymentMethodId: 'pix',
      payer: {
        email: order.client?.email,
        identification: {
          type: order.client?.cpf,
          number: order.client?.cpf,
        },
      },
    };

    const response =
      await this.paymentRepositoryPersistence.createPayment(body);

    order.paymentStatus = 'GeneratedQRCode';
    order.paymentId = response.orderId.toString();
    response.orderId = order.id.toString();
    await this.orderRepositoryPersistence.update(order);

    return response;
  }
}
