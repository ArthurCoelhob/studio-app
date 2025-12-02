import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceType } from './service-type.entity';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectRepository(ServiceType)
    private serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async create(createServiceTypeDto: CreateServiceTypeDto): Promise<ServiceType> {
    const serviceType = this.serviceTypeRepository.create(createServiceTypeDto);
    return this.serviceTypeRepository.save(serviceType);
  }

  async findAll(): Promise<ServiceType[]> {
    return this.serviceTypeRepository.find();
  }

  async findOne(id: number): Promise<ServiceType> {
    const serviceType = await this.serviceTypeRepository.findOne({ where: { id } });
    if (!serviceType) {
      throw new NotFoundException(`ServiceType with ID ${id} not found`);
    }
    return serviceType;
  }

  async update(id: number, updateServiceTypeDto: UpdateServiceTypeDto): Promise<ServiceType> {
    await this.findOne(id);
    await this.serviceTypeRepository.update(id, updateServiceTypeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.serviceTypeRepository.delete(id);
  }
}