import api from './api';

export interface ServiceType {
  id?: number;
  name: string;
  sessionCount: number;
}

export class ServiceTypeService {
  static async getAll(): Promise<ServiceType[]> {
    const response = await api.get('/service-types');
    return response.data;
  }

  static async getById(id: number): Promise<ServiceType> {
    const response = await api.get(`/service-types/${id}`);
    return response.data;
  }

  static async create(serviceType: ServiceType): Promise<ServiceType> {
    const response = await api.post('/service-types', serviceType);
    return response.data;
  }

  static async update(id: number, serviceType: Partial<ServiceType>): Promise<ServiceType> {
    const response = await api.patch(`/service-types/${id}`, serviceType);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/service-types/${id}`);
  }
}