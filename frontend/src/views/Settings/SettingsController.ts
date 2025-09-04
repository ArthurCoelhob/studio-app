import { Component, Vue } from 'vue-property-decorator';
import { Professional } from '@/types';
import { MockService } from '@/services/mockService';

interface Service {
  id: number
  name: string
  type: 'pilates' | 'fisioterapia'
  sessions: number
}

interface Schedule {
  id: number
  name: string
  type: 'weekday' | 'weekend'
  startTime: string
  endTime: string
}

@Component
export default class SettingsController extends Vue {
  // #region DATA
  public professionals: Professional[] = [];
  public services: Service[] = [
    { id: 1, name: 'Pilates Clássico', type: 'pilates', sessions: 12 },
    { id: 2, name: 'Fisioterapia Ortopédica', type: 'fisioterapia', sessions: 10 },
    { id: 3, name: 'Pilates Funcional', type: 'pilates', sessions: 8 },
  ];
  public schedules: Schedule[] = [
    { id: 1, name: 'Segunda a Sexta', type: 'weekday', startTime: '08:00', endTime: '18:00' },
    { id: 2, name: 'Sábado', type: 'weekend', startTime: '08:00', endTime: '12:00' },
  ];
  public notifications = true;
  public autoConfirm = false;
  public sessionDuration = 60;
  
  // Dialog states
  public serviceDialog = false;
  public professionalDialog = false;
  public scheduleDialog = false;
  public expandedPanels = [0, 1, 2]; // Todos os painéis abertos por padrão
  
  // Notificações
  public snackbar = false;
  public snackbarText = '';
  public snackbarColor = 'success';
  
  // Editing states
  public editingService: Service | null = null;
  public editingProfessional: Professional | null = null;
  public editingSchedule: Schedule | null = null;
  
  // Form validation
  public serviceValid = false;
  public professionalValid = false;
  public scheduleValid = false;
  
  // Form data
  public serviceForm = {
    name: '',
    type: 'pilates' as 'pilates' | 'fisioterapia',
    sessions: 1,
  };
  
  public professionalForm = {
    name: '',
    specialty: 'pilates' as 'pilates' | 'fisioterapia',
  };
  
  public scheduleForm = {
    name: '',
    startTime: '',
    endTime: '',
  };
  
  // Options
  public serviceTypes = [
    { text: 'Pilates', value: 'pilates' },
    { text: 'Fisioterapia', value: 'fisioterapia' },
  ];
  
  public specialties = [
    { text: 'Pilates', value: 'pilates' },
    { text: 'Fisioterapia', value: 'fisioterapia' },
  ];
  
  public rules = {
    required: (v: any) => !!v || 'Campo obrigatório'
  };
  // #endregion

  // #region LIFECYCLE
  public async mounted(): Promise<void> {
    await this.loadProfessionals();
  }
  
  // Private methods
  private async loadProfessionals(): Promise<void> {
    this.professionals = await MockService.getProfessionals();
  }
  // #endregion
  
  // #region METHODS
  public openServiceDialog(): void {
    this.editingService = null;
    this.serviceForm = { name: '', type: 'pilates', sessions: 1 };
    this.serviceDialog = true;
  }
  
  public closeServiceDialog(): void {
    this.serviceDialog = false;
    this.editingService = null;
  }
  
  public saveService(): void {
    if (!this.serviceValid) return;
    
    if (this.editingService) {
      this.updateService();
    } else {
      this.createService();
    }
    
    this.closeServiceDialog();
  }
  
  private updateService(): void {
    const index = this.services.findIndex(s => s.id === this.editingService!.id);
    if (index > -1) {
      this.services[index] = { ...this.editingService!, ...this.serviceForm };
      this.showNotification('Serviço atualizado com sucesso!', 'success');
    }
  }
  
  private createService(): void {
    const newService: Service = { id: Date.now(), ...this.serviceForm };
    this.services.push(newService);
    this.showNotification('Serviço cadastrado com sucesso!', 'success');
  }
  
  public editService(service: Service): void {
    this.editingService = service;
    this.serviceForm = { name: service.name, type: service.type, sessions: service.sessions };
    this.serviceDialog = true;
  }
  
  public deleteService(service: Service): void {
    if (confirm(`Tem certeza que deseja excluir o serviço ${service.name}?`)) {
      const index = this.services.findIndex(s => s.id === service.id);
      if (index > -1) {
        this.services.splice(index, 1);
        this.showNotification('Serviço excluído com sucesso!', 'success');
      }
    }
  }
  
  // Professional methods
  public openProfessionalDialog(): void {
    this.editingProfessional = null;
    this.professionalForm = { name: '', specialty: 'pilates' };
    this.professionalDialog = true;
  }
  
  public closeProfessionalDialog(): void {
    this.professionalDialog = false;
    this.editingProfessional = null;
  }
  
  public saveProfessional(): void {
    if (!this.professionalValid) return;
    
    if (this.editingProfessional) {
      this.updateProfessional();
    } else {
      this.createProfessional();
    }
    
    this.closeProfessionalDialog();
  }
  
  private updateProfessional(): void {
    const index = this.professionals.findIndex(p => p.id === this.editingProfessional!.id);
    if (index > -1) {
      this.professionals[index] = { ...this.editingProfessional!, ...this.professionalForm };
      this.showNotification('Profissional atualizado com sucesso!', 'success');
    }
  }
  
  private createProfessional(): void {
    const newProfessional: Professional = { id: Date.now(), ...this.professionalForm };
    this.professionals.push(newProfessional);
    this.showNotification('Profissional cadastrado com sucesso!', 'success');
  }
  
  public editProfessional(professional: Professional): void {
    this.editingProfessional = professional;
    this.professionalForm = { name: professional.name, specialty: professional.specialty };
    this.professionalDialog = true;
  }
  
  public deleteProfessional(professional: Professional): void {
    if (confirm(`Tem certeza que deseja excluir o profissional ${professional.name}?`)) {
      const index = this.professionals.findIndex(p => p.id === professional.id);
      if (index > -1) {
        this.professionals.splice(index, 1);
        this.showNotification('Profissional excluído com sucesso!', 'success');
      }
    }
  }
  
  // Schedule methods
  public editSchedule(schedule: Schedule): void {
    this.editingSchedule = schedule;
    this.scheduleForm = {
      name: schedule.name,
      startTime: schedule.startTime,
      endTime: schedule.endTime
    };
    this.scheduleDialog = true;
  }
  
  public closeScheduleDialog(): void {
    this.scheduleDialog = false;
    this.editingSchedule = null;
  }
  
  public saveSchedule(): void {
    if (!this.scheduleValid || !this.editingSchedule) return;
    
    const index = this.schedules.findIndex(s => s.id === this.editingSchedule!.id);
    if (index > -1) {
      this.schedules[index] = {
        ...this.editingSchedule,
        startTime: this.scheduleForm.startTime,
        endTime: this.scheduleForm.endTime
      };
      this.showNotification('Horário atualizado com sucesso!', 'success');
    }
    
    this.closeScheduleDialog();
  }

  public showNotification(text: string, color: string = 'success'): void {
    this.snackbarText = text;
    this.snackbarColor = color;
    this.snackbar = true;
  }
  // #endregion
}