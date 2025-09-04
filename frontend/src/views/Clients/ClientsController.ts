import { Component, Vue } from 'vue-property-decorator';
import { Client } from '@/types';

@Component
export default class ClientsController extends Vue {
  // #region DATA
  public clients: Client[] = [
    {
      id: 1,
      name: 'Maria Silva',
      cpf: '123.456.789-01',
      email: 'maria@email.com',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - São Paulo/SP',
      frequency: 3,
      active: true,
    },
    {
      id: 2,
      name: 'João Santos',
      cpf: '987.654.321-09',
      email: 'joao@email.com',
      phone: '(11) 88888-8888',
      address: 'Av. Paulista, 456 - São Paulo/SP',
      frequency: 2,
      active: true,
    },
    {
      id: 3,
      name: 'Ana Costa',
      cpf: '456.789.123-45',
      email: 'ana@email.com',
      phone: '(11) 77777-7777',
      address: 'Rua Augusta, 789 - São Paulo/SP',
      frequency: 1,
      active: false,
    }
  ];

  public headers = [
    { text: '', value: 'avatar', sortable: false, width: '60px' },
    { text: 'Nome', value: 'name' },
    { text: 'CPF', value: 'cpf' },
    { text: 'Email', value: 'email' },
    { text: 'Telefone', value: 'phone' },
    { text: 'Frequência', value: 'frequency', width: '120px' },
    { text: 'Status', value: 'status', width: '100px' },
    { text: 'Ações', value: 'actions', sortable: false, width: '120px' },
  ];

  // Dialog states
  public clientDialog = false;
  public editingClient: Client | null = null;
  public valid = false;
  
  // Notificações
  public snackbar = false;
  public snackbarText = '';
  public snackbarColor = 'success';
  
  // Form data
  public clientForm = {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    frequency: 1,
    active: true,
  };

  public frequencyOptions = [
    { text: '1x por semana', value: 1 },
    { text: '2x por semana', value: 2 },
    { text: '3x por semana', value: 3 },
    { text: '4x por semana', value: 4 },
    { text: '5x por semana', value: 5 },
  ];

  public rules = {
    required: (v: any)    => !!v || 'Campo obrigatório',
    email   : (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
    cpf     : (v: string) => {
      if (!v) return 'CPF é obrigatório';
      const cleanCpf = v.replace(/\D/g, '');
      return cleanCpf.length === 11 || 'CPF deve ter 11 dígitos';
    }
  };
  // #endregion

  // #region COMPUTED
  public get totalClients(): number {
    return this.clients.length;
  }

  public get activeClients(): number {
    return this.clients.filter(c => c.active).length;
  }

  public get newClients(): number {
    return 5; // Mock data
  }
  // #endregion

  // #region METHODS
  public openClientDialog(): void {
    this.editingClient = null;
    this.clientForm = {
      name: '',
      cpf: '',
      email: '',
      phone: '',
      address: '',
      frequency: 1,
      active: true
    };
    this.clientDialog = true;
  }

  public closeClientDialog(): void {
    this.clientDialog = false;
    this.editingClient = null;
  }

  public saveClient(): void {
    if (!this.valid) return;

    if (this.editingClient) {
      this.updateClient();
    } else {
      this.createClient();
    }

    this.closeClientDialog();
  }

  public editClient(client: Client): void {
    this.editingClient = client;
    this.clientForm = {
      name: client.name,
      cpf: client.cpf,
      email: client.email,
      phone: client.phone,
      address: client.address,
      frequency: client.frequency,
      active: client.active,
    };
    this.clientDialog = true;
  }

  public viewClient(client: Client): void {
    console.log('View client:', client);
  }

  public toggleClientStatus(client: Client): void {
    const action = client.active ? 'inativar' : 'ativar';
    if (confirm(`Tem certeza que deseja ${action} este cliente?`)) {
      const index = this.clients.findIndex(c => c.id === client.id);
      if (index > -1) {
        this.clients[index].active = !this.clients[index].active;
        this.showNotification(`Cliente ${client.active ? 'inativado' : 'ativado'} com sucesso!`, 'success');
      }
    }
  }

  public deleteClient(client: Client): void {
    if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      const index = this.clients.findIndex(c => c.id === client.id);
      if (index > -1) {
        this.clients.splice(index, 1);
        this.showNotification('Cliente excluído com sucesso!', 'success');
      }
    }
  }

  public formatCpf(): void {
    let value = this.clientForm.cpf.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.clientForm.cpf = value;
    }
  }

  public onCpfInput(): void {
    this.formatCpf();
  }

  public showNotification(text: string, color: string = 'success'): void {
    this.snackbarText = text;
    this.snackbarColor = color;
    this.snackbar = true;
  }
  // #endregion

  // #region PRIVATE METHODS
  private updateClient(): void {
    const index = this.clients.findIndex(c => c.id === this.editingClient!.id);
    if (index > -1) {
      this.clients[index] = {
        ...this.editingClient!,
        ...this.clientForm
      };
    }
    this.showNotification('Cliente atualizado com sucesso!', 'success');
  }

  private createClient(): void {
    const newClient: Client = {
      id: Date.now(),
      ...this.clientForm
    };
    this.clients.push(newClient);
    this.showNotification('Cliente cadastrado com sucesso!', 'success');
  }
  // #endregion
}