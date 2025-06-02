import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Payment, MercadoPagoConfig } from 'mercadopago';

import { OrderRepositoryPersistence } from 'src/infrastructure/persistence/prisma/order/order.repository.persistence';
import { OrderId } from 'src/domain/entities/order/order.entity';

type TEnv = string;

@Injectable()
export class PaymentUseCase {
  constructor(
    private readonly orderRepositoryPersistence: OrderRepositoryPersistence,
  ) {}

  async payment(orderId: string) {
    const order = await this.orderRepositoryPersistence.findById(
      new OrderId(orderId),
    );

    if (!order) throw new NotFoundException('Order not found');

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as TEnv,
    });

    const payment = new Payment(client);
    const dateOfExpiration = new Date();
    dateOfExpiration.setMinutes(dateOfExpiration.getMinutes() + 6);

    const body = {
      transaction_amount: order.total,
      date_of_expiration: dateOfExpiration.toISOString(),
      payment_method_id: 'pix',
      payer: {
        email: order.client?.email,
        identification: {
          type: order.client?.cpf,
          number: order.client?.cpf,
        },
      },
    };

    if (order.paymentStatus !== 'Pending') {
      throw new BadRequestException('Payment already in progress');
    }

    const response = await payment.create({
      body: body,
    });

    if (response.api_response?.status !== 201) {
      throw new BadRequestException('Payment creation failed');
    }

    order.paymentStatus = 'GeneratedQRCode';
    order.paymentId = response.id?.toString() || null;
    await this.orderRepositoryPersistence.update(order);

    return {
      orderId: orderId,
      ticketUrl: response.point_of_interaction?.transaction_data?.ticket_url,
      qrCode: response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64:
        response.point_of_interaction?.transaction_data?.qr_code_base64,
    };
  }
}
