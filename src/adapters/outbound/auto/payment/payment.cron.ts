import { Inject, Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';

import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';
import { PaymentRepositoryPersistence } from 'src/infrastructure/persistence/mercadoPago/payment.repository.persistence';

@Injectable()
export class TaskServiceCheckoutPayment {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
    @Inject('PaymentRepositoryInterface')
    private readonly paymentRepositoryPersistence: PaymentRepositoryPersistence,
  ) {}

  //@Cron('*/5 * * * * *')
  async checkoutPayment() {
    const { data } =
      await this.orderRepositoryPersistence.findByStatusPayment(
        'GeneratedQRCode',
      );

    if (data.length > 0) {
      await Promise.all(
        data.map(async (order) => {
          const response =
            await this.paymentRepositoryPersistence.checkoutPayment(
              order.paymentId!.toString(),
            );

          if (response.status === 'approved') {
            order.status = 'Confirmed';
            order.paymentStatus = 'Concluded';
            await this.orderRepositoryPersistence.update(order);
          } else if (
            response.status === 'cancelled' ||
            response.status === 'rejected'
          ) {
            order.status = 'Canceled';
            order.paymentStatus = 'Canceled';
            await this.orderRepositoryPersistence.update(order);
          }

          return;
        }),
      );
    }
  }
}
