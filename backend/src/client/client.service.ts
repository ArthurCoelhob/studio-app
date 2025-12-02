import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ServiceTypeService } from '../service-type/service-type.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private serviceTypeService: ServiceTypeService,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    await this.serviceTypeService.findOne(createClientDto.serviceTypeId);
    
    const hashedPassword = await bcrypt.hash(createClientDto.password, 10);
    
    const client = this.clientRepository.create({
      ...createClientDto,
      password: hashedPassword,
      role: 'client',
    });
    
    return this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({ relations: ['serviceType'] });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ 
      where: { id }, 
      relations: ['serviceType'] 
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    await this.findOne(id);
    
    if (updateClientDto.serviceTypeId) {
      await this.serviceTypeService.findOne(updateClientDto.serviceTypeId);
    }
    
    if (updateClientDto.password) {
      updateClientDto.password = await bcrypt.hash(updateClientDto.password, 10);
    }
    
    await this.clientRepository.update(id, updateClientDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.clientRepository.delete(id);
  }
}