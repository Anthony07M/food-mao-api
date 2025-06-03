import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @IsIn([
    'Received',
    'In_Progress',
    'Ready',
    'Concluded',
    'Concluded_not_received',
  ])
  status?:
    | 'Received'
    | 'In_Progress'
    | 'Ready'
    | 'Concluded'
    | 'Concluded_not_received';
}
