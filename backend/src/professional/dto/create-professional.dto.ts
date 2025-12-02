import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ProfileType } from '../professional.entity';

export class CreateProfessionalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  serviceTypeId: number;

  @IsEnum(ProfileType)
  profile: ProfileType;
}