import { Injectable } from '@nestjs/common';
import { Payment, MercadoPagoConfig } from 'mercadopago';

type TEnv = string;

@Injectable()
export class PaymentUseCase {
  async payment(orderId: string) {
    console.log(orderId); // Parâmetro para selecionar através da ordem os dados do cliente para gerar o pagamento

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as TEnv,
    });
    const payment = new Payment(client);

    try {
      const response = await payment.create({
        body: {
          transaction_amount: 10,
          date_of_expiration: '2025-05-31T19:30:00.000-04:00',
          payment_method_id: 'pix',
          notification_url: 'https://www.google.com/',
          payer: {
            email: 'user@example.com',
            identification: {
              type: 'CPF',
              number: '19119119100',
            },
          },
        },
      });

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
}
