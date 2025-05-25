import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @IsIn([
    'Pending',
    'Concluded',
    'Canceled',
    'In_Progress',
    'Confirmed',
    'Rejected',
    'Started',
  ])
  status?:
    | 'Pending'
    | 'Concluded'
    | 'Canceled'
    | 'In_Progress'
    | 'Confirmed'
    | 'Rejected'
    | 'Started';

  @IsOptional()
  @IsString()
  @IsIn(['Pending', 'Canceled', 'GeneratedQRCode', 'Concluded'])
  paymentStatus?: 'Pending' | 'Canceled' | 'GeneratedQRCode' | 'Concluded';
}