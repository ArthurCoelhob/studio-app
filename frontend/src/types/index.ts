export interface User {
  id: number
  name: string
  cpf: string
  role: 'admin' | 'client'
}

export interface Client {
  id: number
  name: string
  cpf: string
  email: string
  phone: string
  address: string
  frequency: number
  active: boolean
}

export interface Professional {
  id: number
  name: string
  specialty: 'pilates' | 'fisioterapia'
}

export interface Appointment {
  id: number
  userId: number
  clientId?: number
  professionalId: number
  service: 'pilates' | 'fisioterapia'
  date: string
  time: string
  status: 'agendado' | 'cancelado' | 'concluido'
}

export interface TimeSlot {
  time: string
  available: boolean
}