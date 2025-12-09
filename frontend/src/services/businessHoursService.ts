import api from './api';

export interface BusinessHour {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export class BusinessHoursService {
  static async getAll(): Promise<BusinessHour[]> {
    const response = await api.get('/business-hours');
    return response.data;
  }

  static async getOne(id: number): Promise<BusinessHour> {
    const response = await api.get(`/business-hours/${id}`);
    return response.data;
  }

  static async create(businessHour: BusinessHour): Promise<BusinessHour> {
    const response = await api.post('/business-hours', businessHour);
    return response.data;
  }

  static async update(id: number, businessHour: BusinessHour): Promise<BusinessHour> {
    const response = await api.patch(`/business-hours/${id}`, businessHour);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/business-hours/${id}`);
  }

  static async deleteMultiple(ids: number[]): Promise<void> {
    await api.post('/business-hours/bulk-delete', { ids });
  }

  static async updateMultiple(updates: Array<{ id: number; startTime: string; endTime: string }>): Promise<void> {
    await api.post('/business-hours/bulk-update', { updates });
  }
}
