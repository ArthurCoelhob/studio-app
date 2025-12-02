import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { Professional } from './professional.entity';
import { ServiceTypeModule } from '../service-type/service-type.module';

@Module({
  imports: [TypeOrmModule.forFeature([Professional]), ServiceTypeModule],
  controllers: [ProfessionalController],
  providers: [ProfessionalService],
  exports: [ProfessionalService],
})
export class ProfessionalModule {}