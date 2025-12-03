import api from './api';

export interface Client {
  id?: number;
  name: string;
  cpf: string;
  address: string;
  phone: string;
  attendance?: number;
  serviceTypeId: number;
  email: string;
  password?: string;
  role?: string;
  serviceType?: {
    id: number;
    name: string;
  };
}

export class ClientService {
  static async getAll(): Promise<Client[]> {
    const response = await api.get('/clients');
    return response.data;
  }

  static async getById(id: number): Promise<Client> {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  }

  static async create(client: Omit<Client, 'id' | 'serviceType' | 'role' | 'attendance'>): Promise<Client> {
    const response = await api.post('/clients', client);
    return response.data;
  }

  static async update(id: number, client: Partial<Omit<Client, 'id' | 'serviceType' | 'role'>>): Promise<Client> {
    const response = await api.patch(`/clients/${id}`, client);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/clients/${id}`);
  }
}