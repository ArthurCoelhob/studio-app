import { Vue, Component } from 'vue-property-decorator';
import { Professional, ProfessionalService } from '@/services/professionalService';
import { ServiceType, ServiceTypeService } from '@/services/serviceTypeService';
import { Client, ClientService } from '@/services/clientService';

interface Appointment {
  id?: number;
  clientId: number;
  professionalId: number;
  serviceTypeId: number;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  client?: Client;
  professional?: Professional;
  serviceType?: ServiceType;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: Appointment;
}

interface DaySchedule {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  timeSlots: TimeSlot[];
}

@Component
export default class ScheduleController extends Vue {
  // #region DATA
  public appointments: Appointment[] = [];
  public clients: Client[] = [];
  public professionals: Professional[] = [];
  public serviceTypes: ServiceType[] = [];
  
  public currentWeek: Date = new Date();
  public weekDays: DaySchedule[] = [];
  public loading = false;
  
  // Filters
  public selectedProfessional: number | null = null;
  public selectedServiceType: number | null = null;
  public clientSearch: string | null = null;
  
  // Dialog
  public appointmentDialog = false;
  public deleteDialog = false;
  public editingAppointment: Appointment | null = null;
  public deletingAppointment: Appointment | null = null;
  public appointmentValid = false;
  
  public appointmentForm = {
    clientId: null as number | null,
    professionalId: null as number | null,
    serviceTypeId: null as number | null,
    date: '',
    time: '',
    status: 'scheduled' as 'scheduled' | 'confirmed' | 'completed' | 'cancelled',
  };
  
  // Business hours (mockado)
  public businessHours = {
    start: 9,
    end: 18,
    interval: 60, // minutos
  };
  
  public statusOptions = [
    { text: 'Agendado', value: 'scheduled', color: 'primary' },
    { text: 'Confirmado', value: 'confirmed', color: 'success' },
    { text: 'Concluído', value: 'completed', color: 'grey' },
    { text: 'Cancelado', value: 'cancelled', color: 'error' },
  ];
  
  public rules = {
    required: (v: any) => !!v || 'Campo obrigatório'
  };
  // #endregion

  // #region COMPUTED
  public get formTitle(): string {
    return this.editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento';
  }

  public get filteredProfessionals(): Professional[] {
    if (!this.selectedServiceType) return this.professionals;
    return this.professionals.filter(p => p.serviceTypeId === this.selectedServiceType);
  }

  public get weekRange(): string {
    const start = this.getWeekStart(this.currentWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `${start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  }
  // #endregion

  // #region LIFECYCLE
  public async mounted(): Promise<void> {
    await this.loadData();
    this.generateWeekSchedule();
  }
  // #endregion

  // #region METHODS
  public async loadData(): Promise<void> {
    this.loading = true;
    try {
      await Promise.all([
        this.loadClients(),
        this.loadProfessionals(),
        this.loadServiceTypes(),
        this.loadAppointments(),
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadClients(): Promise<void> {
    this.clients = await ClientService.getAll();
  }

  private async loadProfessionals(): Promise<void> {
    this.professionals = await ProfessionalService.getAll();
  }

  private async loadServiceTypes(): Promise<void> {
    this.serviceTypes = await ServiceTypeService.getAll();
  }

  private async loadAppointments(): Promise<void> {
    // Mock data - substituir por API real
    this.appointments = [
      {
        id: 1,
        clientId: 1,
        professionalId: 1,
        serviceTypeId: 1,
        date: '2025-01-13',
        time: '10:00',
        status: 'confirmed'
      },
      {
        id: 2,
        clientId: 2,
        professionalId: 1,
        serviceTypeId: 1,
        date: '2025-01-14',
        time: '14:00',
        status: 'scheduled'
      }
    ];
  }

  public generateWeekSchedule(): void {
    const weekStart = this.getWeekStart(this.currentWeek);
    this.weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const daySchedule: DaySchedule = {
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: this.isToday(date),
        timeSlots: this.generateTimeSlots(date)
      };
      
      this.weekDays.push(daySchedule);
    }
  }

  private generateTimeSlots(date: Date): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dateStr = date.toISOString().split('T')[0];
    
    for (let hour = this.businessHours.start; hour < this.businessHours.end; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const appointment = this.appointments.find(
        a => a.date === dateStr && a.time === time && this.matchesFilters(a)
      );
      
      slots.push({
        time,
        available: !appointment,
        appointment
      });
    }
    
    return slots;
  }

  private matchesFilters(appointment: Appointment): boolean {
    if (this.selectedProfessional && appointment.professionalId !== this.selectedProfessional) {
      return false;
    }
    if (this.selectedServiceType && appointment.serviceTypeId !== this.selectedServiceType) {
      return false;
    }
    return true;
  }

  private getWeekStart(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    return start;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  public previousWeek(): void {
    this.currentWeek.setDate(this.currentWeek.getDate() - 7);
    this.generateWeekSchedule();
  }

  public nextWeek(): void {
    this.currentWeek.setDate(this.currentWeek.getDate() + 7);
    this.generateWeekSchedule();
  }

  public goToToday(): void {
    this.currentWeek = new Date();
    this.generateWeekSchedule();
  }

  public onFilterChange(): void {
    this.generateWeekSchedule();
  }

  public openAppointmentDialog(date?: string, time?: string): void {
    this.editingAppointment = null;
    this.appointmentForm = {
      clientId: null,
      professionalId: this.selectedProfessional,
      serviceTypeId: this.selectedServiceType,
      date: date || '',
      time: time || '',
      status: 'scheduled'
    };
    this.appointmentDialog = true;
  }

  public editAppointment(appointment: Appointment): void {
    this.editingAppointment = appointment;
    this.appointmentForm = {
      clientId: appointment.clientId,
      professionalId: appointment.professionalId,
      serviceTypeId: appointment.serviceTypeId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status
    };
    this.appointmentDialog = true;
  }

  public closeAppointmentDialog(): void {
    this.appointmentDialog = false;
    this.editingAppointment = null;
  }

  public saveAppointment(): void {
    if (!this.appointmentValid) return;
    
    if (this.editingAppointment) {
      this.updateAppointment();
    } else {
      this.createAppointment();
    }
    
    this.closeAppointmentDialog();
  }

  private createAppointment(): void {
    const newAppointment: Appointment = {
      id: Date.now(),
      ...this.appointmentForm
    } as Appointment;
    
    this.appointments.push(newAppointment);
    this.generateWeekSchedule();
    this.$emit('show-notification', 'Agendamento criado com sucesso!', 'success');
  }

  private updateAppointment(): void {
    const index = this.appointments.findIndex(a => a.id === this.editingAppointment!.id);
    if (index > -1) {
      this.appointments[index] = { ...this.editingAppointment!, ...this.appointmentForm } as Appointment;
      this.generateWeekSchedule();
      this.$emit('show-notification', 'Agendamento atualizado com sucesso!', 'success');
    }
  }

  public deleteAppointment(appointment: Appointment): void {
    this.deletingAppointment = appointment;
    this.deleteDialog = true;
  }

  public closeDeleteDialog(): void {
    this.deleteDialog = false;
    this.deletingAppointment = null;
  }

  public confirmDelete(): void {
    if (!this.deletingAppointment) return;
    
    const index = this.appointments.findIndex(a => a.id === this.deletingAppointment!.id);
    if (index > -1) {
      this.appointments.splice(index, 1);
      this.generateWeekSchedule();
      this.$emit('show-notification', 'Agendamento excluído com sucesso!', 'success');
    }
    
    this.closeDeleteDialog();
  }

  public getClientName(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  }

  public getProfessionalName(professionalId: number): string {
    const professional = this.professionals.find(p => p.id === professionalId);
    return professional ? professional.name : 'Profissional não encontrado';
  }

  public getServiceTypeName(serviceTypeId: number): string {
    const serviceType = this.serviceTypes.find(s => s.id === serviceTypeId);
    return serviceType ? serviceType.name : 'Serviço não encontrado';
  }

  public getStatusColor(status: string): string {
    const statusOption = this.statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'grey';
  }

  public getStatusText(status: string): string {
    const statusOption = this.statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.text : status;
  }
  // #endregion
}