import { Component, Vue } from 'vue-property-decorator';
import { MockService } from '@/services/mockService';

@Component
export default class LoginController extends Vue {
  // #region DATA
  public loading = false;
  public showPassword = false;
  public valid = false;
  
  public form = {
    cpf: '',
    password: '',
  };

  public rules = {
    required: (v: any) => !!v || 'Campo obrigatório',
    cpf: (v: string) => {
      if (!v) return 'CPF é obrigatório';
      const cleanCpf = v.replace(/\D/g, '');
      return cleanCpf.length === 11 || 'CPF deve ter 11 dígitos';
    },
    password: (v: string) => {
      if (!v) return 'Senha é obrigatória';
      return v.length >= 3 || 'Senha deve ter pelo menos 3 caracteres';
    }
  };

  public errorMessage = '';
  // #endregion

  // #region COMPUTED
  public get isAuthenticated() {
    return this.$store.getters.isAuthenticated;
  }
  // #endregion

  // #region LIFECYCLE
  public mounted(): void {
    if (this.isAuthenticated) {
      this.$router.push('/home');
    }
  }
  // #endregion

  // #region METHODS
  public async login(): Promise<void> {
    if (!this.form.cpf) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const user = await MockService.login(this.form.cpf, this.form.password);
      
      if (user) {
        this.$store.dispatch('login', user);
        this.$router.push('/home');
      } else {
        this.errorMessage = 'CPF não encontrado';
      }
    } catch (error) {
      this.errorMessage = 'Erro ao fazer login. Tente novamente.';
      console.error('Login error:', error);
    } finally {
      this.loading = false;
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public clearError(): void {
    this.errorMessage = '';
  }

  public formatCpf(): void {
    let value = this.form.cpf.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.form.cpf = value;
    }
  }

  public onCpfInput(): void {
    this.formatCpf();
    this.clearError();
  }

  public onPasswordInput(): void {
    this.clearError();
  }

  public getPasswordFieldType(): string {
    return this.showPassword ? 'text' : 'password';
  }

  public getPasswordIcon(): string {
    return this.showPassword ? 'mdi-eye' : 'mdi-eye-off';
  }
  // #endregion

  // #region PRIVATE METHODS
  private resetForm(): void {
    this.form = {
      cpf: '',
      password: ''
    };
    this.valid = false;
    this.errorMessage = '';
  }
  // #endregion
}