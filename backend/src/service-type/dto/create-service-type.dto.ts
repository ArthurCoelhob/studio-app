import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateServiceTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  sessionCount: number;
}