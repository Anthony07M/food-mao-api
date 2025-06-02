import { IsNotEmpty, IsUUID } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  @IsUUID()
  orderId: string;
}
