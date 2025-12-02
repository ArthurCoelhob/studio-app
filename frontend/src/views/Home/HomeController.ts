import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HomeController extends Vue {
  // #region DATA
  public loading = false;
  public stats = {
    totalAppointments: 24,
    todayAppointments: 5,
    activeClients: 18,
    revenue: 2450
  };

  public recentAppointments = [
    { id: 1, client: 'Maria Silva', service: 'Pilates', time: '09:00', status: 'confirmed' },
    { id: 2, client: 'João Santos', service: 'Fisioterapia', time: '10:30', status: 'pending' },
    { id: 3, client: 'Ana Costa', service: 'Pilates', time: '14:00', status: 'confirmed' },
  ];

  public notifications = [
    { id: 1, type: 'appointment', message: 'Novo agendamento para hoje às 15:00', time: '2 min atrás' },
    { id: 2, type: 'payment', message: 'Pagamento recebido de Maria Silva', time: '1 hora atrás' },
    { id: 3, type: 'reminder', message: 'Lembrete: Consulta com João Santos em 30 min', time: '2 horas atrás' },
  ];
  // #endregion

  // #region COMPUTED
  public get currentUser() {
    return this.$store.getters.currentUser;
  }

  public get isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  public get greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  public get currentDate() {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  // #endregion

  // #region LIFECYCLE
  public async mounted(): Promise<void> {
    await this.loadDashboardData();
  }
  // #endregion

  // #region METHODS
  public navigateToSchedule(): void {
    this.$router.push('/schedule');
  }

  public navigateToClients(): void {
    this.$router.push('/clients');
  }

  public navigateToSettings(): void {
    this.$router.push('/settings');
  }

  public markNotificationAsRead(notificationId: number): void {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  public getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending'  : return 'warning';
      case 'cancelled': return 'error';
      default         : return 'primary';
    }
  }

  public getStatusText(status: string): string {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending'  : return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default         : return 'Agendado';
    }
  }

  public getNotificationIcon(type: string): string {
    switch (type) {
      case 'appointment': return 'mdi-calendar-check';
      case 'payment'    : return 'mdi-cash';
      case 'reminder'   : return 'mdi-bell-ring';
      default           : return 'mdi-information';
    }
  }

  public getNotificationColor(type: string): string {
    switch (type) {
      case 'appointment': return 'primary';
      case 'payment'    : return 'success';
      case 'reminder'   : return 'warning';
      default           : return 'info';
    }
  }
  // #endregion

  // #region PRIVATE METHODS
  private async loadDashboardData(): Promise<void> {
    this.loading = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      this.loading = false;
    }
  }
  // #endregion
}