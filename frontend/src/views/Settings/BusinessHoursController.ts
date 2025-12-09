import { Vue, Component } from 'vue-property-decorator';
import { BusinessHour, BusinessHoursService } from '@/services/businessHoursService';

@Component
export default class BusinessHoursController extends Vue {
  public businessHours: BusinessHour[] = [];
  public businessHourDialog = false;
  public deleteDialog = false;
  public bulkEditDialog = false;
  public editingBusinessHour: BusinessHour | null = null;
  public deletingBusinessHours: BusinessHour[] = [];
  public selectedBusinessHours: BusinessHour[] = [];
  public businessHourValid = false;
  public bulkEditValid = false;

  public businessHourForm = {
    daysOfWeek: [] as number[],
    startTime: '',
    endTime: '',
  };

  public bulkEditForm = {
    startTime: '',
    endTime: '',
  };

  public dayOptions = [
    { text: 'Domingo', value: 0 },
    { text: 'Segunda-feira', value: 1 },
    { text: 'Terça-feira', value: 2 },
    { text: 'Quarta-feira', value: 3 },
    { text: 'Quinta-feira', value: 4 },
    { text: 'Sexta-feira', value: 5 },
    { text: 'Sábado', value: 6 },
  ];

  public rules = {
    required: (v: any) => !!v || v === 0 || 'Campo obrigatório',
  };

  public async loadBusinessHours(): Promise<void> {
    try {
      this.businessHours = await BusinessHoursService.getAll();
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      this.$emit('show-notification', 'Erro ao carregar horários', 'error');
    }
  }

  public openBusinessHourDialog(): void {
    this.editingBusinessHour = null;
    this.businessHourForm = {
      daysOfWeek: [],
      startTime: '',
      endTime: '',
    };
    this.businessHourDialog = true;
  }

  public editBusinessHour(businessHour: BusinessHour): void {
    this.editingBusinessHour = businessHour;
    this.businessHourForm = {
      daysOfWeek: [businessHour.dayOfWeek],
      startTime: businessHour.startTime,
      endTime: businessHour.endTime,
    };
    this.businessHourDialog = true;
  }

  public closeBusinessHourDialog(): void {
    this.businessHourDialog = false;
    this.editingBusinessHour = null;
  }

  public async saveBusinessHour(): Promise<void> {
    if (!this.businessHourValid) return;

    try {
      if (this.editingBusinessHour) {
        const updateData = {
          dayOfWeek: this.businessHourForm.daysOfWeek[0],
          startTime: this.businessHourForm.startTime,
          endTime: this.businessHourForm.endTime,
        };
        await BusinessHoursService.update(this.editingBusinessHour.id!, updateData as BusinessHour);
        this.$emit('show-notification', 'Horário atualizado com sucesso!', 'success');
      } else {
        for (const dayOfWeek of this.businessHourForm.daysOfWeek) {
          const newBusinessHour = {
            dayOfWeek,
            startTime: this.businessHourForm.startTime,
            endTime: this.businessHourForm.endTime,
          };
          await BusinessHoursService.create(newBusinessHour as BusinessHour);
        }
        this.$emit('show-notification', `${this.businessHourForm.daysOfWeek.length} horário(s) criado(s) com sucesso!`, 'success');
      }
      await this.loadBusinessHours();
      this.closeBusinessHourDialog();
    } catch (error) {
      console.error('Erro ao salvar horário:', error);
      this.$emit('show-notification', 'Erro ao salvar horário', 'error');
    }
  }

  public deleteBusinessHour(businessHour: BusinessHour): void {
    this.deletingBusinessHours = [businessHour];
    this.deleteDialog = true;
  }

  public deleteMultipleBusinessHours(): void {
    this.deletingBusinessHours = [...this.selectedBusinessHours];
    this.deleteDialog = true;
  }

  public closeDeleteDialog(): void {
    this.deleteDialog = false;
    this.deletingBusinessHours = [];
  }

  public async confirmDelete(): Promise<void> {
    if (this.deletingBusinessHours.length === 0) return;

    try {
      if (this.deletingBusinessHours.length === 1) {
        await BusinessHoursService.delete(this.deletingBusinessHours[0].id!);
        this.$emit('show-notification', 'Horário excluído com sucesso!', 'success');
      } else {
        await BusinessHoursService.deleteMultiple(this.deletingBusinessHours.map(bh => bh.id!));
        this.$emit('show-notification', `${this.deletingBusinessHours.length} horários excluídos com sucesso!`, 'success');
      }
      await this.loadBusinessHours();
      this.clearSelection();
      this.closeDeleteDialog();
    } catch (error) {
      console.error('Erro ao excluir horário(s):', error);
      this.$emit('show-notification', 'Erro ao excluir horário(s)', 'error');
    }
  }

  public editMultipleBusinessHours(): void {
    if (this.selectedBusinessHours.length === 0) return;
    this.bulkEditForm = {
      startTime: this.selectedBusinessHours[0].startTime,
      endTime: this.selectedBusinessHours[0].endTime,
    };
    this.bulkEditDialog = true;
  }

  public closeBulkEditDialog(): void {
    this.bulkEditDialog = false;
  }

  public async saveBulkEdit(): Promise<void> {
    if (!this.bulkEditValid || this.selectedBusinessHours.length === 0) return;

    try {
      const updates = this.selectedBusinessHours.map(bh => ({
        id: bh.id!,
        startTime: this.bulkEditForm.startTime,
        endTime: this.bulkEditForm.endTime,
      }));
      await BusinessHoursService.updateMultiple(updates);
      this.$emit('show-notification', `${updates.length} horário(s) atualizado(s) com sucesso!`, 'success');
      await this.loadBusinessHours();
      this.clearSelection();
      this.closeBulkEditDialog();
    } catch (error) {
      console.error('Erro ao atualizar horários:', error);
      this.$emit('show-notification', 'Erro ao atualizar horários', 'error');
    }
  }

  public clearSelection(): void {
    this.selectedBusinessHours = [];
  }

  public getDayName(dayOfWeek: number): string {
    const day = this.dayOptions.find(d => d.value === dayOfWeek);
    return day ? day.text : '';
  }
}
