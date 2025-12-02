import { Component, Vue } from 'vue-property-decorator';
import { Professional } from '@/types';
import ServiceController from './ServiceController';

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

  public schedules: Schedule[] = [
    { id: 1, name: 'Segunda a Sexta', type: 'weekday', startTime: '08:00', endTime: '18:00' },
    { id: 2, name: 'Sábado', type: 'weekend', startTime: '08:00', endTime: '12:00' },
  ];
  public notifications = true;
  public autoConfirm = false;
  public sessionDuration = 60;
  
  // Dialog states
  public professionalDialog = false;
  public scheduleDialog = false;
  public expandedPanels = [0, 1, 2]; // Todos os painéis abertos por padrão
  
  // Notificações
  public snackbar = false;
  public snackbarText = '';
  public snackbarColor = 'success';
  
  // Editing states
  public editingProfessional: Professional | null = null;
  public editingSchedule: Schedule | null = null;
  
  // Form validation
  public professionalValid = false;
  public scheduleValid = false;
  
  // Form data
  
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

  
  public specialties = [
    { text: 'Pilates', value: 'pilates' },
    { text: 'Fisioterapia', value: 'fisioterapia' },
  ];
  
  public rules = {
    required: (v: any) => !!v || 'Campo obrigatório'
  };
  // #endregion

  // Service Controller
  public serviceController = new ServiceController();

  // #region LIFECYCLE
  public async mounted(): Promise<void> {
    this.serviceController.$on('show-notification', this.showNotification);
    await this.serviceController.loadServices();
  }
  // #endregion
  
  // #region METHODS
  // Service methods - delegated to ServiceController
  public openServiceDialog(): void {
    this.serviceController.openServiceDialog();
  }
  
  public closeServiceDialog(): void {
    this.serviceController.closeServiceDialog();
  }
  
  public saveService(): void {
    this.serviceController.saveService();
  }
  
  public editService(service: any): void {
    this.serviceController.editService(service);
  }
  
  public deleteService(service: any): void {
    this.serviceController.deleteService(service);
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