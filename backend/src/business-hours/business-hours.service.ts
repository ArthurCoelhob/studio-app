import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessHourDto } from './dto/create-business-hour.dto';
import { UpdateBusinessHourDto } from './dto/update-business-hour.dto';
import { BusinessHour } from './entities/business-hour.entity';

@Injectable()
export class BusinessHoursService {
  constructor(
    @InjectRepository(BusinessHour)
    private businessHoursRepository: Repository<BusinessHour>,
  ) {}

  create(createBusinessHourDto: CreateBusinessHourDto) {
    const businessHour = this.businessHoursRepository.create(createBusinessHourDto);
    return this.businessHoursRepository.save(businessHour);
  }

  findAll() {
    return this.businessHoursRepository.find({ order: { dayOfWeek: 'ASC' } });
  }

  findOne(id: number) {
    return this.businessHoursRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBusinessHourDto: UpdateBusinessHourDto) {
    await this.businessHoursRepository.update(id, updateBusinessHourDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.businessHoursRepository.delete(id);
    return { deleted: true };
  }

  async bulkDelete(ids: number[]) {
    await this.businessHoursRepository.delete(ids);
    return { deleted: true, count: ids.length };
  }

  async bulkUpdate(updates: Array<{ id: number; startTime: string; endTime: string }>) {
    const promises = updates.map(update => 
      this.businessHoursRepository.update(update.id, {
        startTime: update.startTime,
        endTime: update.endTime,
      })
    );
    await Promise.all(promises);
    return { updated: true, count: updates.length };
  }
}
