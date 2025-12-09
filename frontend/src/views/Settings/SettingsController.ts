import { Component, Vue } from 'vue-property-decorator';
import ServiceController from './ServiceController';
import ProfessionalController from './ProfessionalController';
import BusinessHoursController from './BusinessHoursController';

@Component
export default class SettingsController extends Vue {
  // #region DATA


  public expandedPanels = [0, 1, 2]; // Todos os painéis abertos por padrão
  
  // Notificações
  public snackbar = false;
  public snackbarText = '';
  public snackbarColor = 'success';
  // #endregion

  // Controllers
  public serviceController = new ServiceController();
  public professionalController = new ProfessionalController();
  public businessHoursController = new BusinessHoursController();

  // #region LIFECYCLE
  public async mounted(): Promise<void> {
    this.serviceController.$on('show-notification', this.showNotification);
    this.professionalController.$on('show-notification', this.showNotification);
    this.businessHoursController.$on('show-notification', this.showNotification);
    
    await this.serviceController.loadServices();
    await this.professionalController.loadServiceTypes();
    await this.professionalController.loadProfessionals();
    await this.businessHoursController.loadBusinessHours();
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
  
  // BusinessHours methods - delegated to BusinessHoursController
  public openBusinessHourDialog(): void {
    this.businessHoursController.openBusinessHourDialog();
  }
  
  public closeBusinessHourDialog(): void {
    this.businessHoursController.closeBusinessHourDialog();
  }
  
  public saveBusinessHour(): void {
    this.businessHoursController.saveBusinessHour();
  }
  
  public editBusinessHour(businessHour: any): void {
    this.businessHoursController.editBusinessHour(businessHour);
  }
  
  public deleteBusinessHour(businessHour: any): void {
    this.businessHoursController.deleteBusinessHour(businessHour);
  }

  public editMultipleBusinessHours(): void {
    this.businessHoursController.editMultipleBusinessHours();
  }

  public deleteMultipleBusinessHours(): void {
    this.businessHoursController.deleteMultipleBusinessHours();
  }

  public saveBulkEdit(): void {
    this.businessHoursController.saveBulkEdit();
  }

  public showNotification(text: string, color: string = 'success'): void {
    this.snackbarText = text;
    this.snackbarColor = color;
    this.snackbar = true;
  }
  // #endregion
}