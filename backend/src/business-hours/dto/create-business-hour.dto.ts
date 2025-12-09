import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateBusinessHourDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;
}
