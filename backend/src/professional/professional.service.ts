import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './professional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ServiceTypeService } from '../service-type/service-type.service';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(Professional)
    private professionalRepository: Repository<Professional>,
    private serviceTypeService: ServiceTypeService,
  ) {}

  async create(createProfessionalDto: CreateProfessionalDto): Promise<Professional> {
    await this.serviceTypeService.findOne(createProfessionalDto.serviceTypeId);
    
    const professional = this.professionalRepository.create(createProfessionalDto);
    return this.professionalRepository.save(professional);
  }

  async findAll(): Promise<Professional[]> {
    return this.professionalRepository.find({ relations: ['serviceType'] });
  }

  async findOne(id: number): Promise<Professional> {
    const professional = await this.professionalRepository.findOne({ 
      where: { id }, 
      relations: ['serviceType'] 
    });
    if (!professional) {
      throw new NotFoundException(`Professional with ID ${id} not found`);
    }
    return professional;
  }

  async update(id: number, updateProfessionalDto: UpdateProfessionalDto): Promise<Professional> {
    await this.findOne(id);
    
    if (updateProfessionalDto.serviceTypeId) {
      await this.serviceTypeService.findOne(updateProfessionalDto.serviceTypeId);
    }
    
    await this.professionalRepository.update(id, updateProfessionalDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.professionalRepository.delete(id);
  }
}