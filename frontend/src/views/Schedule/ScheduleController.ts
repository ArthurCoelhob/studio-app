import { Component, Vue } from 'vue-property-decorator';
import { Professional, Appointment, TimeSlot, Client } from '@/types';
import { MockService } from '@/services/mockService';

@Component
export default class ScheduleController extends Vue {
  // #region DATA
  public professionals: Professional[] = [];
  public userAppointments: Appointment[] = [];
  public allAppointments: Appointment[] = [];
  public timeSlots: TimeSlot[] = [];
  public clients: Client[] = [];
  public selectedDate = '';
  public focus = '';
  public viewMode = 'month';
  public appointmentDialog = false;
  public currentStep = 1;
  public editingAppointment: Appointment | null = null;
  public clientSearch = '';
  
  public appointmentForm = {
    service: '',
    professionalId: null as number | null,
    clientId: null as number | null,
    date: '',
    time: '',
  };

  public services = [
    { text: 'Pilates', value: 'pilates' },
    { text: 'Fisioterapia', value: 'fisioterapia' },
  ];
  // #endregion

  // #region COMPUTED
  public get currentUser() {
    return this.$store.getters.currentUser;
  }

  public get isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  public get totalAppointments() {
    return this.isAdmin ? this.allAppointments.length : this.userAppointments.length;
  }

  public get currentMonthTitle() {
    const date = new Date(this.focus || new Date());
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  public get formatSelectedDatePT() {
    if (!this.selectedDate) return '';
    return new Date(this.selectedDate).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  public get dayAppointments() {
    if (!this.selectedDate) return [];
    const appointments = this.isAdmin ? this.allAppointments : this.userAppointments;
    return appointments.filter(a => a.date === this.selectedDate);
  }

  public get weekDays() {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  }

  public get calendarDays() {
    const currentDate = new Date(this.focus || new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push({
        date: date.toISOString().substr(0, 10),
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isToday(date),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    
    return days;
  }

  public get filteredProfessionals() {
    if (!this.appointmentForm.service) return [];
    return this.professionals.filter(p => p.specialty === this.appointmentForm.service);
  }

  public get filteredClients() {
    if (!this.clientSearch) return this.clients;
    return this.clients.filter(c => 
      c.name.toLowerCase().includes(this.clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(this.clientSearch.toLowerCase())
    );
  }

  public get availableTimeSlots() {
    return this.timeSlots;
  }

  public get canSaveAppointment() {
    const baseRequirements = this.appointmentForm.service && 
                           this.appointmentForm.professionalId && 
                           this.appointmentForm.date && 
                           this.appointmentForm.time;
    
    if (this.isAdmin) {
      return baseRequirements && this.appointmentForm.clientId;
    }
    
    return baseRequirements;
  }
  // #endregion

  // #region LIFECYCLE
  public async mounted(): Promise<void> {
    await this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    this.professionals = await MockService.getProfessionals();
    this.timeSlots = await MockService.getTimeSlots();
    this.clients = await MockService.getClients();
    this.focus = new Date().toISOString().substr(0, 10);
    
    if (this.currentUser) {
      if (this.isAdmin) {
        this.allAppointments = await MockService.getAllAppointments();
      } else {
        this.userAppointments = await MockService.getUserAppointments(this.currentUser.id);
      }
    }
  }
  // #endregion

  // #region METHODS
  public selectDate(date: string): void {
    this.selectedDate = date;
    this.openNewAppointment();
  }

  public previousMonth(): void {
    const currentDate = new Date(this.focus || new Date());
    currentDate.setMonth(currentDate.getMonth() - 1);
    this.focus = currentDate.toISOString().substr(0, 10);
  }

  public nextMonth(): void {
    const currentDate = new Date(this.focus || new Date());
    currentDate.setMonth(currentDate.getMonth() + 1);
    this.focus = currentDate.toISOString().substr(0, 10);
  }

  public goToToday(): void {
    this.focus = new Date().toISOString().substr(0, 10);
    this.selectedDate = this.focus;
  }

  public openNewAppointment(): void {
    this.editingAppointment = null;
    this.appointmentForm = {
      service: '',
      professionalId: null,
      clientId: null,
      date: this.selectedDate || new Date().toISOString().substr(0, 10),
      time: ''
    };
    this.currentStep = 1;
    this.clientSearch = '';
    this.appointmentDialog = true;
  }

  public editAppointment(appointment: Appointment): void {
    this.editingAppointment = appointment;
    this.appointmentForm = {
      service: appointment.service,
      professionalId: appointment.professionalId,
      clientId: appointment.clientId || null,
      date: appointment.date,
      time: appointment.time
    };
    this.currentStep = this.isAdmin ? 4 : 3;
    this.appointmentDialog = true;
  }

  public deleteAppointment(appointment: Appointment): void {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      if (this.isAdmin) {
        const index = this.allAppointments.findIndex(a => a.id === appointment.id);
        if (index > -1) {
          this.allAppointments.splice(index, 1);
        }
      } else {
        const index = this.userAppointments.findIndex(a => a.id === appointment.id);
        if (index > -1) {
          this.userAppointments.splice(index, 1);
        }
      }
      alert('Agendamento excluído com sucesso!');
    }
  }

  public closeAppointmentDialog(): void {
    this.appointmentDialog = false;
    this.currentStep = 1;
    this.editingAppointment = null;
    this.clientSearch = '';
  }

  public selectService(service: string): void {
    this.appointmentForm.service = service;
    this.appointmentForm.professionalId = null;
  }

  public selectProfessional(professionalId: number): void {
    this.appointmentForm.professionalId = professionalId;
  }

  public selectClient(clientId: number): void {
    this.appointmentForm.clientId = clientId;
  }

  public selectTime(time: string): void {
    this.appointmentForm.time = time;
  }

  public nextStep(): void {
    const maxStep = this.isAdmin ? 4 : 3;
    if (this.currentStep < maxStep) {
      this.currentStep++;
    }
  }

  public previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  public saveAppointment(): void {
    if (!this.canSaveAppointment || !this.currentUser) return;

    if (this.editingAppointment) {
      this.updateAppointment();
    } else {
      this.createAppointment();
    }

    this.closeAppointmentDialog();
  }

  public showEventDetails({ event }: any): void {
    console.log('Event details:', event);
  }

  public getProfessionalName(id: number): string {
    const professional = this.professionals.find(p => p.id === id);
    return professional?.name || 'Profissional não encontrado';
  }

  public getClientName(id: number): string {
    const client = this.clients.find(c => c.id === id);
    return client?.name || 'Cliente não encontrado';
  }

  public getDayClasses(day: any): string[] {
    const classes = [];
    if (!day.isCurrentMonth) classes.push('other-month');
    if (day.isToday) classes.push('today');
    if (day.isWeekend) classes.push('weekend');
    if (this.getDayAppointments(day.date).length > 0) classes.push('has-appointments');
    if (this.selectedDate === day.date) classes.push('selected');
    return classes;
  }

  public getDayNumberClasses(day: any): string[] {
    const classes = [];
    if (day.isToday) classes.push('today-number');
    if (!day.isCurrentMonth) classes.push('other-month-number');
    return classes;
  }

  public getDayAppointments(date: string): Appointment[] {
    const appointments = this.isAdmin ? this.allAppointments : this.userAppointments;
    return appointments.filter(a => a.date === date);
  }
  // #endregion

  // #region PRIVATE METHODS
  private updateAppointment(): void {
    const appointments = this.isAdmin ? this.allAppointments : this.userAppointments;
    const index = appointments.findIndex(a => a.id === this.editingAppointment!.id);
    if (index > -1) {
      appointments[index] = {
        ...this.editingAppointment!,
        service: this.appointmentForm.service as 'pilates' | 'fisioterapia',
        professionalId: this.appointmentForm.professionalId!,
        clientId: this.appointmentForm.clientId || undefined,
        date: this.appointmentForm.date,
        time: this.appointmentForm.time
      };
      alert('Agendamento atualizado com sucesso!');
    }
  }

  private createAppointment(): void {
    const newAppointment: Appointment = {
      id: Date.now(),
      userId: this.currentUser!.id,
      professionalId: this.appointmentForm.professionalId!,
      clientId: this.appointmentForm.clientId || undefined,
      service: this.appointmentForm.service as 'pilates' | 'fisioterapia',
      date: this.appointmentForm.date,
      time: this.appointmentForm.time,
      status: 'agendado'
    };
    
    if (this.isAdmin) {
      this.allAppointments.push(newAppointment);
    } else {
      this.userAppointments.push(newAppointment);
    }
    
    this.$store.dispatch('addAppointment', newAppointment);
    alert('Agendamento criado com sucesso!');
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
  // #endregion
}