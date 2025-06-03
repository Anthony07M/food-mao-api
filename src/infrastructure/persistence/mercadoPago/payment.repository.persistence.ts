import { Injectable, BadRequestException } from '@nestjs/common';

import { MercadoPagoService } from 'src/infrastructure/config/mercadoPago/mercado-pago.service';
import { CreatePayment } from 'src/adapters/shared/repositories/payment.interface';

@Injectable()
export class PaymentRepositoryPersistence {
  constructor(private readonly MercadoPagoService: MercadoPagoService) {}

  async createPayment(body: CreatePayment): Promise<{
    orderId: string;
    ticketUrl: string;
    qrCode: string;
    qrCodeBase64: string;
  }> {
    const client = this.MercadoPagoService.createClientPayment(
      process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
    );

    const response = await client.create({
      body: {
        transaction_amount: body.transactionAmount,
        date_of_expiration: body.dateOfExpiration,
        payment_method_id: body.paymentMethodId,
        payer: {
          email: body.payer.email,
          identification: {
            type: body.payer.identification.type,
            number: body.payer.identification.number,
          },
        },
      },
    });

    if (response.api_response.status !== 201) {
      throw new BadRequestException(
        'Payment creation failed. Please try again.',
      );
    }

    return {
      orderId: response.id!.toString(),
      ticketUrl:
        response.point_of_interaction!.transaction_data!.ticket_url || '',
      qrCode: response.point_of_interaction!.transaction_data!.qr_code || '',
      qrCodeBase64:
        response.point_of_interaction!.transaction_data!.qr_code_base64 || '',
    };
  }
}
