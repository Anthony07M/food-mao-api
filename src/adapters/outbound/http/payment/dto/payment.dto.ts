import { IsNotEmpty, IsUUID } from 'class-validator';

export class PaymentDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;
}

export class WebHookDto {
  @IsNotEmpty()
  action: string;
  @IsNotEmpty()
  api_version: string;
  @IsNotEmpty()
  data: {
    id: string;
  };
  @IsNotEmpty()
  date_created: string;
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  live_mode: boolean;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  user_id: number;
}
