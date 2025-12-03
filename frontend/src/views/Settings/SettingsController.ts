import { Component, Vue } from 'vue-property-decorator';
import ServiceController from './ServiceController';
import ProfessionalController from './ProfessionalController';

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


  public schedules: Schedule[] = [
    { id: 1, name: 'Segunda a Sexta', type: 'weekday', startTime: '08:00', endTime: '18:00' },
    { id: 2, name: 'Sábado', type: 'weekend', startTime: '08:00', endTime: '12:00' },
  ];
  public notifications = true;
  public autoConfirm = false;
  public sessionDuration = 60;
  
  // Dialog states
  public scheduleDialog = false;
  public expandedPanels = [0, 1, 2]; // Todos os painéis abertos por padrão
  
  // Notificações
  public snackbar = false;
  public snackbarText = '';
  public snackbarColor = 'success';
  
  // Editing states
  public editingSchedule: Schedule | null = null;
  
  // Form validation
  public scheduleValid = false;
  
  // Form data
  
  public scheduleForm = {
    name: '',
    startTime: '',
    endTime: '',
  };
  
  // Options

  

  
  public rules = {
    required: (v: any) => !!v || 'Campo obrigatório'
  };
  // #endregion

  // Controllers
  public serviceController = new ServiceController();
  public professionalController = new ProfessionalController();

  // #region LIFECYCLE
  public async mounted(): Promise<void> {
    this.serviceController.$on('show-notification', this.showNotification);
    this.professionalController.$on('show-notification', this.showNotification);
    
    await this.serviceController.loadServices();
    await this.professionalController.loadServiceTypes();
    await this.professionalController.loadProfessionals();
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
  
  // Professional methods - delegated to ProfessionalController
  public openProfessionalDialog(): void {
    this.professionalController.openProfessionalDialog();
  }
  
  public closeProfessionalDialog(): void {
    this.professionalController.closeProfessionalDialog();
  }
  
  public saveProfessional(): void {
    this.professionalController.saveProfessional();
  }
  
  public editProfessional(professional: any): void {
    this.professionalController.editProfessional(professional);
  }
  
  public deleteProfessional(professional: any): void {
    this.professionalController.deleteProfessional(professional);
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