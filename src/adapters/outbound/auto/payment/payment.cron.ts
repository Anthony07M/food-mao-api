import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PaymentRepositoryPersistence } from 'src/infrastructure/persistence/mercadoPago/payment.repository.persistence';
import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';

@Injectable()
export class TasksServiceCheckoutPayment {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
    @Inject('PaymentRepositoryInterface')
    private readonly paymentRepositoryPersistence: PaymentRepositoryPersistence,
  ) {}

  @Cron('*/5 * * * * *')
  async checkoutPayment() {
    const { data } =
      await this.orderRepositoryPersistence.findByStatusPayment(
        'GeneratedQRCode',
      );

    await Promise.all(
      data.map(async (order) => {
        const response =
          await this.paymentRepositoryPersistence.checkoutPayment(
            order.paymentId!.toString(),
          );

        if (response === 'cancelled') {
          order.status = 'Canceled';
          order.paymentStatus = 'Canceled';
          await this.orderRepositoryPersistence.update(order);
        } else {
          if (response === 'approved') {
            order.status = 'Confirmed';
            order.paymentStatus = 'Concluded';
            await this.orderRepositoryPersistence.update(order);
          }
        }

        return;
      }),
    );
  }
}
