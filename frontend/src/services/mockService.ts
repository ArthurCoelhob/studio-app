import { User, Professional, Appointment, TimeSlot, Client } from '@/types';

export const mockUsers: User[] = [
  { id: 1, name: 'Admin Studio', cpf: '1', role: 'admin' },
  { id: 2, name: 'Messi', cpf: '2', role: 'client' }
];

export const mockProfessionals: Professional[] = [
  { id: 1, name: 'Dr. Kaio Jorge', specialty: 'fisioterapia' },
  { id: 2, name: 'Danielle', specialty: 'pilates' },
  { id: 3, name: 'Nathalia', specialty: 'pilates' }
];

export const mockTimeSlots: TimeSlot[] = [
  { time: '08:00', available: true },
  { time: '09:00', available: false },
  { time: '10:00', available: true },
  { time: '11:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: false },
  { time: '16:00', available: true },
  { time: '17:00', available: true }
];

export const mockClients: Client[] = [
  { id: 1, name: 'Maria Silva', cpf: '123.456.789-01', email: 'maria@email.com', phone: '(11) 99999-9999', address: 'Rua das Flores, 123 - São Paulo/SP', frequency: 3, active: true },
  { id: 2, name: 'João Santos', cpf: '987.654.321-09', email: 'joao@email.com', phone: '(11) 88888-8888', address: 'Av. Paulista, 456 - São Paulo/SP', frequency: 2, active: true },
  { id: 3, name: 'Ana Costa', cpf: '456.789.123-45', email: 'ana@email.com', phone: '(11) 77777-7777', address: 'Rua Augusta, 789 - São Paulo/SP', frequency: 1, active: true },
  { id: 4, name: 'Pedro Lima', cpf: '321.654.987-12', email: 'pedro@email.com', phone: '(11) 66666-6666', address: 'Rua da Consolação, 321 - São Paulo/SP', frequency: 4, active: true }
];

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    userId: 2,
    clientId: 1,
    professionalId: 1,
    service: 'fisioterapia',
    date: '2024-01-15',
    time: '09:00',
    status: 'agendado'
  },
  {
    id: 2,
    userId: 2,
    clientId: 2,
    professionalId: 2,
    service: 'pilates',
    date: '2024-01-16',
    time: '15:00',
    status: 'agendado'
  }
];

export class MockService {
  static login(cpf: string, password: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.cpf === cpf);
        resolve(user || null);
      }, 500);
    });
  }

  static getProfessionals(): Promise<Professional[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProfessionals), 300);
    });
  }

  static getTimeSlots(): Promise<TimeSlot[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTimeSlots), 300);
    });
  }

  static getUserAppointments(userId: number): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointments = mockAppointments.filter(a => a.userId === userId);
        resolve(appointments);
      }, 300);
    });
  }

  static getClients(): Promise<Client[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockClients), 300);
    });
  }

  static getAllAppointments(): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAppointments), 300);
    });
  }
}