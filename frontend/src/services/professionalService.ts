import api from './api';

export interface Professional {
  id?: number;
  name: string;
  serviceTypeId: number;
  profile: 'admin' | 'professional';
  serviceType?: {
    id: number;
    name: string;
  };
}

export class ProfessionalService {
  static async getAll(): Promise<Professional[]> {
    const response = await api.get('/professionals');
    return response.data;
  }

  static async getById(id: number): Promise<Professional> {
    const response = await api.get(`/professionals/${id}`);
    return response.data;
  }

  static async create(professional: Omit<Professional, 'id' | 'serviceType'>): Promise<Professional> {
    const response = await api.post('/professionals', professional);
    return response.data;
  }

  static async update(id: number, professional: Partial<Omit<Professional, 'id' | 'serviceType'>>): Promise<Professional> {
    const response = await api.patch(`/professionals/${id}`, professional);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/professionals/${id}`);
  }
}