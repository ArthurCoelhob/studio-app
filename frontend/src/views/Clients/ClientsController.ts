import { Vue, Component } from 'vue-property-decorator';
import { Client, ClientService } from '@/services/clientService';
import { ServiceType, ServiceTypeService } from '@/services/serviceTypeService';

@Component
export default class ClientsController extends Vue {
  // #region DATA
  public clients: Client[] = [];
  public serviceTypes: ServiceType[] = [];
  public clientDialog = false;
  public deleteDialog = false;
  public editingClient: Client | null = null;
  public deletingClient: Client | null = null;
  public clientValid = false;
  public loading = false;
  public search = '';
  
  public clientForm = {
    name: '',
    cpf: '',
    address: '',
    phone: '',
    serviceTypeId: null as number | null,
    email: '',
    password: '',
  };
  
  public headers = [
    { text: 'Nome', value: 'name', sortable: true },
    { text: 'CPF', value: 'cpf', sortable: true },
    { text: 'Email', value: 'email', sortable: true },
    { text: 'Telefone', value: 'phone', sortable: false },
    { text: 'Tipo de Serviço', value: 'serviceType.name', sortable: true },
    { text: 'Atendimentos', value: 'attendance', sortable: true },
    { text: 'Ações', value: 'actions', sortable: false, width: '120' },
  ];
  
  public rules = {
    required: (v: any) => !!v || 'Campo obrigatório',
    email: (v: string) => /.+@.+\..+/.test(v) || 'Email deve ser válido',
    cpf: (v: string) => /^\d{11}$/.test(v.replace(/\D/g, '')) || 'CPF deve ter 11 dígitos',
  };
  // #endregion

  // #region COMPUTED
  public get formTitle(): string {
    return this.editingClient ? 'Editar Cliente' : 'Novo Cliente';
  }
  // #endregion

  // #region LIFECYCLE
  public async mounted(): Promise<void> {
    await this.loadServiceTypes();
    await this.loadClients();
  }
  // #endregion

  // #region METHODS
  public async loadClients(): Promise<void> {
    this.loading = true;
    try {
      this.clients = await ClientService.getAll();
    } catch (error) {
      this.$emit('show-notification', 'Erro ao carregar clientes', 'error');
    } finally {
      this.loading = false;
    }
  }

  public async loadServiceTypes(): Promise<void> {
    try {
      this.serviceTypes = await ServiceTypeService.getAll();
    } catch (error) {
      console.error('Erro ao carregar tipos de serviço:', error);
    }
  }

  public openClientDialog(): void {
    this.editingClient = null;
    this.clientForm = { 
      name: '', 
      cpf: '', 
      address: '', 
      phone: '', 
      serviceTypeId: this.serviceTypes.length > 0 ? this.serviceTypes[0].id! : null, 
      email: '', 
      password: '' 
    };
    this.clientDialog = true;
  }
  
  public closeClientDialog(): void {
    this.clientDialog = false;
    this.editingClient = null;
  }
  
  public saveClient(): void {
    if (!this.clientValid) return;
    
    if (this.editingClient) {
      this.updateClient();
    } else {
      this.createClient();
    }
    
    this.closeClientDialog();
  }
  
  private async updateClient(): Promise<void> {
    if (!this.clientForm.serviceTypeId) return;
    
    try {
      const formData = {
        name: this.clientForm.name,
        cpf: this.clientForm.cpf.replace(/\D/g, ''),
        address: this.clientForm.address,
        phone: this.clientForm.phone,
        serviceTypeId: this.clientForm.serviceTypeId,
        email: this.clientForm.email,
        ...(this.clientForm.password && { password: this.clientForm.password })
      };
      await ClientService.update(this.editingClient!.id!, formData);
      await this.loadClients();
      this.$emit('show-notification', 'Cliente atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      this.$emit('show-notification', 'Erro ao atualizar cliente', 'error');
    }
  }
  
  private async createClient(): Promise<void> {
    if (!this.clientForm.serviceTypeId) return;
    
    try {
      const formData = {
        name: this.clientForm.name,
        cpf: this.clientForm.cpf.replace(/\D/g, ''),
        address: this.clientForm.address,
        phone: this.clientForm.phone,
        serviceTypeId: this.clientForm.serviceTypeId,
        email: this.clientForm.email,
        password: this.clientForm.password
      };
      await ClientService.create(formData);
      await this.loadClients();
      this.$emit('show-notification', 'Cliente cadastrado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      this.$emit('show-notification', 'Erro ao criar cliente', 'error');
    }
  }
  
  public editClient(client: Client): void {
    this.editingClient = client;
    this.clientForm = { 
      name: client.name, 
      cpf: client.cpf,
      address: client.address,
      phone: client.phone,
      serviceTypeId: client.serviceTypeId,
      email: client.email,
      password: ''
    };
    this.clientDialog = true;
  }
  
  public deleteClient(client: Client): void {
    this.deletingClient = client;
    this.deleteDialog = true;
  }

  public closeDeleteDialog(): void {
    this.deleteDialog = false;
    this.deletingClient = null;
  }

  public async confirmDelete(): Promise<void> {
    if (!this.deletingClient) return;
    
    try {
      await ClientService.delete(this.deletingClient.id!);
      await this.loadClients();
      this.$emit('show-notification', 'Cliente excluído com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      this.$emit('show-notification', 'Erro ao excluir cliente', 'error');
    }
    
    this.closeDeleteDialog();
  }

  public formatCpf(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  public formatPhone(phone: string): string {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }
  // #endregion
}