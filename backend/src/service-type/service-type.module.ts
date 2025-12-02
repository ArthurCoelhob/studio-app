import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTypeService } from './service-type.service';
import { ServiceTypeController } from './service-type.controller';
import { ServiceType } from './service-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceType])],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
  exports: [ServiceTypeService],
})
export class ServiceTypeModule {}