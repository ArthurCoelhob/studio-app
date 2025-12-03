import { Vue, Component } from 'vue-property-decorator';
import { Professional, ProfessionalService } from '@/services/professionalService';
import { ServiceType, ServiceTypeService } from '@/services/serviceTypeService';

@Component
export default class ProfessionalController extends Vue {
  // #region DATA
  public professionals: Professional[] = [];
  public serviceTypes: ServiceType[] = [];
  public professionalDialog = false;
  public deleteDialog = false;
  public editingProfessional: Professional | null = null;
  public deletingProfessional: Professional | null = null;
  public professionalValid = false;
  
  public professionalForm = {
    name: '',
    serviceTypeId: null as number | null,
    profile: 'professional' as 'admin' | 'professional',
  };
  
  public profileOptions = [
    { text: 'Administrador', value: 'admin' },
    { text: 'Profissional', value: 'professional' },
  ];
  
  public rules = {
    required: (v: any) => !!v || 'Campo obrigatório'
  };
  // #endregion

  // #region METHODS
  public async loadProfessionals(): Promise<void> {
    try {
      this.professionals = await ProfessionalService.getAll();
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      this.$emit('show-notification', 'Erro ao carregar profissionais', 'error');
    }
  }

  public async loadServiceTypes(): Promise<void> {
    try {
      this.serviceTypes = await ServiceTypeService.getAll();
    } catch (error) {
      console.error('Erro ao carregar tipos de serviço:', error);
    }
  }

  public openProfessionalDialog(): void {
    this.editingProfessional = null;
    this.professionalForm = { 
      name: '', 
      serviceTypeId: this.serviceTypes.length > 0 ? this.serviceTypes[0].id! : null, 
      profile: 'professional' 
    };
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
  
  private async updateProfessional(): Promise<void> {
    if (!this.professionalForm.serviceTypeId) return;
    
    try {
      const formData = {
        name: this.professionalForm.name,
        serviceTypeId: this.professionalForm.serviceTypeId,
        profile: this.professionalForm.profile
      };
      await ProfessionalService.update(this.editingProfessional!.id!, formData);
      await this.loadProfessionals();
      this.$emit('show-notification', 'Profissional atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      this.$emit('show-notification', 'Erro ao atualizar profissional', 'error');
    }
  }
  
  private async createProfessional(): Promise<void> {
    if (!this.professionalForm.serviceTypeId) return;
    
    try {
      const formData = {
        name: this.professionalForm.name,
        serviceTypeId: this.professionalForm.serviceTypeId,
        profile: this.professionalForm.profile
      };
      await ProfessionalService.create(formData);
      await this.loadProfessionals();
      this.$emit('show-notification', 'Profissional cadastrado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao criar profissional:', error);
      this.$emit('show-notification', 'Erro ao criar profissional', 'error');
    }
  }
  
  public editProfessional(professional: Professional): void {
    this.editingProfessional = professional;
    this.professionalForm = { 
      name: professional.name, 
      serviceTypeId: professional.serviceTypeId,
      profile: professional.profile 
    };
    this.professionalDialog = true;
  }
  
  public deleteProfessional(professional: Professional): void {
    this.deletingProfessional = professional;
    this.deleteDialog = true;
  }

  public closeDeleteDialog(): void {
    this.deleteDialog = false;
    this.deletingProfessional = null;
  }

  public async confirmDelete(): Promise<void> {
    if (!this.deletingProfessional) return;
    
    try {
      await ProfessionalService.delete(this.deletingProfessional.id!);
      await this.loadProfessionals();
      this.$emit('show-notification', 'Profissional excluído com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir profissional:', error);
      this.$emit('show-notification', 'Erro ao excluir profissional', 'error');
    }
    
    this.closeDeleteDialog();
  }

  public getServiceTypeName(serviceTypeId: number): string {
    const serviceType = this.serviceTypes.find(st => st.id === serviceTypeId);
    return serviceType ? serviceType.name : 'N/A';
  }

  public getProfileText(profile: string): string {
    return profile === 'admin' ? 'Administrador' : 'Profissional';
  }
  // #endregion
}