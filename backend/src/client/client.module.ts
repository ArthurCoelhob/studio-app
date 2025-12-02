import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './client.entity';
import { ServiceTypeModule } from '../service-type/service-type.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), ServiceTypeModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}