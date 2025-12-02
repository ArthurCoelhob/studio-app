import { Vue, Component } from 'vue-property-decorator';
import { ServiceType, ServiceTypeService } from '@/services/serviceTypeService';

interface Service {
  id?: number
  name: string
  sessionCount: number
}

@Component
export default class ServiceController extends Vue {
  // #region DATA
  public services: Service[] = [];
  public serviceDialog = false;
  public editingService: Service | null = null;
  public serviceValid = false;
  
  public serviceForm = {
    name: '',
    sessionCount: 1,
  };
  
  public rules = {
    required: (v: any) => !!v || 'Campo obrigatório'
  };
  // #endregion

  // #region METHODS
  public async loadServices(): Promise<void> {
    try {
      this.services = await ServiceTypeService.getAll();
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      this.$emit('show-notification', 'Erro ao carregar serviços', 'error');
    }
  }

  public openServiceDialog(): void {
    this.editingService = null;
    this.serviceForm = { name: '', sessionCount: 1 };
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
  
  private async updateService(): Promise<void> {
    try {
      await ServiceTypeService.update(this.editingService!.id!, this.serviceForm);
      await this.loadServices();
      this.$emit('show-notification', 'Serviço atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      this.$emit('show-notification', 'Erro ao atualizar serviço', 'error');
    }
  }
  
  private async createService(): Promise<void> {
    try {
      await ServiceTypeService.create(this.serviceForm);
      await this.loadServices();
      this.$emit('show-notification', 'Serviço cadastrado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      this.$emit('show-notification', 'Erro ao criar serviço', 'error');
    }
  }
  
  public editService(service: Service): void {
    this.editingService = service;
    this.serviceForm = { name: service.name, sessionCount: service.sessionCount };
    this.serviceDialog = true;
  }
  
  public async deleteService(service: Service): Promise<void> {
    if (confirm(`Tem certeza que deseja excluir o serviço ${service.name}?`)) {
      try {
        await ServiceTypeService.delete(service.id!);
        await this.loadServices();
        this.$emit('show-notification', 'Serviço excluído com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        this.$emit('show-notification', 'Erro ao excluir serviço', 'error');
      }
    }
  }
  // #endregion
}