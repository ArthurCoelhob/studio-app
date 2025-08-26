import { User, Professional, Appointment, TimeSlot } from '@/types'

export const mockUsers: User[] = [
  { id: 1, name: 'Admin Studio', cpf: '1', role: 'admin' },
  { id: 2, name: 'Messi', cpf: '2', role: 'client' }
]

export const mockProfessionals: Professional[] = [
  { id: 1, name: 'Dr. Kaio Jorge', specialty: 'fisioterapia' },
  { id: 2, name: 'Danielle', specialty: 'pilates' },
  { id: 3, name: 'CNathalia', specialty: 'pilates' }
]

export const mockTimeSlots: TimeSlot[] = [
  { time: '08:00', available: true },
  { time: '09:00', available: false },
  { time: '10:00', available: true },
  { time: '11:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: false },
  { time: '16:00', available: true },
  { time: '17:00', available: true }
]

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    userId: 2,
    professionalId: 1,
    service: 'fisioterapia',
    date: '2024-01-15',
    time: '09:00',
    status: 'agendado'
  },
  {
    id: 2,
    userId: 2,
    professionalId: 2,
    service: 'pilates',
    date: '2024-01-16',
    time: '15:00',
    status: 'agendado'
  }
]

export class MockService {
  static login(cpf: string, password: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.cpf === cpf)
        resolve(user || null)
      }, 500)
    })
  }

  static getProfessionals(): Promise<Professional[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProfessionals), 300)
    })
  }

  static getTimeSlots(): Promise<TimeSlot[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTimeSlots), 300)
    })
  }

  static getUserAppointments(userId: number): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointments = mockAppointments.filter(a => a.userId === userId)
        resolve(appointments)
      }, 300)
    })
  }
}