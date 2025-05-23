import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateOrderItemDto {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}