// eslint-disable-next-line prettier/prettier
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'CPF must be exactly 11 characters' })
  cpf?: string;
}
