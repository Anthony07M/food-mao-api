import { Injectable } from '@nestjs/common';
import { Payment, MercadoPagoConfig } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  createClientPayment(accessToken: string): Payment {
    const client = new MercadoPagoConfig({ accessToken: accessToken });
    return new Payment(client);
  }
}
