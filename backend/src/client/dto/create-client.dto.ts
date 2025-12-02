import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsNumber()
  attendance?: number;

  @IsNumber()
  serviceTypeId: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}