import { IsNotEmpty, IsUUID } from 'class-validator';

export class PaymentDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;
}
