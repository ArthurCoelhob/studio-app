<template>
  <sidebar-layout>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 primary--text mb-2">Agenda</h1>
        <p class="text-subtitle-1 orange--text">Gerencie os agendamentos da semana</p>
      </v-col>
    </v-row>

    <!-- Filtros e Navegação -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedServiceType"
          :items="serviceTypes"
          item-text="name"
          item-value="id"
          label="Filtrar por Serviço"
          prepend-inner-icon="mdi-medical-bag"
          outlined
          dense
          clearable
          @change="onFilterChange"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedProfessional"
          :items="filteredProfessionals"
          item-text="name"
          item-value="id"
          label="Filtrar por Profissional"
          prepend-inner-icon="mdi-account"
          outlined
          dense
          clearable
          @change="onFilterChange"
        />
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center justify-end">
        <v-btn icon @click="previousWeek" class="mr-2">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div class="text-h6 mx-4">{{ weekRange }}</div>
        <v-btn icon @click="nextWeek" class="mr-2">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn color="primary" @click="goToToday">
          Hoje
        </v-btn>
      </v-col>
    </v-row>

    <!-- Agenda Semanal -->
    <v-card style="border-radius: 16px">
      <v-card-title class="primary white--text pa-6">
        <v-icon left color="white" size="28">mdi-calendar-week</v-icon>
        <div class="text-h5 font-weight-bold">Agenda da Semana</div>
        <v-spacer></v-spacer>
        <v-btn color="white" class="primary--text" @click="openAppointmentDialog()">
          <v-icon left>mdi-plus</v-icon>
          Novo Agendamento
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0">
        <div class="schedule-grid">
          <!-- Header dos dias -->
          <div class="schedule-header">
            <div class="time-column"></div>
            <div 
              v-for="day in weekDays" 
              :key="day.date"
              class="day-header"
              :class="{ 'today': day.isToday }"
            >
              <div class="day-name">{{ day.dayName }}</div>
              <div class="day-number">{{ day.dayNumber }}</div>
            </div>
          </div>

          <!-- Grid de horários -->
          <div class="schedule-body">
            <div 
              v-for="hour in businessHours.end - businessHours.start" 
              :key="hour"
              class="time-row"
            >
              <div class="time-label">
                {{ (businessHours.start + hour - 1).toString().padStart(2, '0') }}:00
              </div>
              <div 
                v-for="day in weekDays" 
                :key="`${day.date}-${hour}`"
                class="time-slot"
                :class="{ 
                  'available': getTimeSlot(day, hour - 1) && getTimeSlot(day, hour - 1).available,
                  'occupied': getTimeSlot(day, hour - 1) && !getTimeSlot(day, hour - 1).available 
                }"
                @click="onTimeSlotClick(day, hour - 1)"
              >
                <div 
                  v-if="getTimeSlot(day, hour - 1) && getTimeSlot(day, hour - 1).appointment"
                  class="appointment-card"
                  :class="`status-${getTimeSlot(day, hour - 1).appointment.status}`"
                >
                  <div class="appointment-client">
                    {{ getClientName(getTimeSlot(day, hour - 1).appointment.clientId) }}
                  </div>
                  <div class="appointment-service">
                    {{ getServiceTypeName(getTimeSlot(day, hour - 1).appointment.serviceTypeId) }}
                  </div>
                  <div class="appointment-actions">
                    <v-btn 
                      icon 
                      x-small 
                      @click.stop="editAppointment(getTimeSlot(day, hour - 1).appointment)"
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn 
                      icon 
                      x-small 
                      @click.stop="deleteAppointment(getTimeSlot(day, hour - 1).appointment)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </div>
                <div v-else class="empty-slot">
                  <v-icon color="grey lighten-2">mdi-plus</v-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Dialog Agendamento Moderno -->
    <v-dialog v-model="appointmentDialog" max-width="700px" persistent>
      <v-card class="appointment-dialog" elevation="24">
        <!-- Header Gradient -->
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-avatar size="56" :color="editingAppointment ? 'warning' : 'success'" class="elevation-4">
                <v-icon size="28" color="white">
                  {{ editingAppointment ? 'mdi-pencil' : 'mdi-calendar-plus' }}
                </v-icon>
              </v-avatar>
            </div>
            <div class="header-text">
              <h2 class="text-h5 font-weight-bold white--text mb-1">{{ formTitle }}</h2>
              <p class="text-subtitle-1 white--text opacity-90 mb-0">
                {{ editingAppointment ? 'Modifique os dados do agendamento' : 'Preencha os dados para o novo agendamento' }}
              </p>
            </div>
            <v-btn icon color="white" @click="closeAppointmentDialog" class="ml-auto">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Form Content -->
        <v-card-text class="pa-8">
          <v-form ref="appointmentForm" v-model="appointmentValid">
            <!-- Cliente Section -->
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="primary" class="mr-2">mdi-account-circle</v-icon>
                Cliente & Serviço
              </h3>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="appointmentForm.clientId"
                    :items="clients"
                    item-text="name"
                    item-value="id"
                    label="Selecione o cliente"
                    prepend-inner-icon="mdi-account-search"
                    outlined
                    dense
                    :rules="[rules.required]"
                    clearable
                    :search-input.sync="clientSearch"
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-avatar>
                        <v-avatar color="primary" size="32">
                          <span class="white--text text-caption">{{ item.name.charAt(0) }}</span>
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="appointmentForm.serviceTypeId"
                    :items="serviceTypes"
                    item-text="name"
                    item-value="id"
                    label="Tipo de Serviço"
                    prepend-inner-icon="mdi-medical-bag"
                    outlined
                    dense
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="appointmentForm.professionalId"
                    :items="filteredProfessionals"
                    item-text="name"
                    item-value="id"
                    label="Profissional"
                    prepend-inner-icon="mdi-account-tie"
                    outlined
                    dense
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Data & Hora Section -->
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
                Data & Horário
              </h3>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="appointmentForm.date"
                    label="Data do agendamento"
                    prepend-inner-icon="mdi-calendar"
                    outlined
                    dense
                    type="date"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="appointmentForm.time"
                    label="Horário"
                    prepend-inner-icon="mdi-clock-outline"
                    outlined
                    dense
                    type="time"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="appointmentForm.status"
                    :items="statusOptions"
                    item-text="text"
                    item-value="value"
                    label="Status do agendamento"
                    prepend-inner-icon="mdi-flag-outline"
                    outlined
                    dense
                    :rules="[rules.required]"
                  >
                    <template v-slot:selection="{ item }">
                      <v-chip :color="item.color" small dark>
                        {{ item.text }}
                      </v-chip>
                    </template>
                    <template v-slot:item="{ item }">
                      <v-chip :color="item.color" small dark class="mr-2">
                        {{ item.text }}
                      </v-chip>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-card-text>
        
        <!-- Actions -->
        <v-card-actions class="pa-8 pt-0">
          <v-btn 
            text 
            color="grey" 
            @click="closeAppointmentDialog"
            class="px-6"
          >
            <v-icon left>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn 
            :color="editingAppointment ? 'warning' : 'success'" 
            :disabled="!appointmentValid" 
            @click="saveAppointment"
            class="px-8 py-2"
            elevation="2"
          >
            <v-icon left>{{ editingAppointment ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
            {{ editingAppointment ? 'Salvar Alterações' : 'Criar Agendamento' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="400px" persistent>
      <v-card style="border-radius: 16px">
        <v-card-title class="error white--text pa-6">
          <v-icon left color="white" size="28">mdi-delete-alert</v-icon>
          <div class="text-h6 font-weight-bold">Confirmar Exclusão</div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div class="text-center">
            <v-icon color="error" size="64" class="mb-4">mdi-delete-circle</v-icon>
            <div class="text-h6 mb-2">Tem certeza?</div>
            <div class="text-body-1">
              Deseja excluir este agendamento?
            </div>
            <div class="text-caption mt-2 error--text">
              Esta ação não pode ser desfeita.
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-btn text @click="closeDeleteDialog">
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn color="error" @click="confirmDelete">
            <v-icon left>mdi-delete</v-icon>
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="5000"
      top
      centered
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </sidebar-layout>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ScheduleController from './ScheduleController'
import SidebarLayout from '@/components/sidebarLayout.vue'

@Component({
  components: {
    SidebarLayout
  }
})
export default class Schedule extends ScheduleController {
  public snackbar = false;
  public snackbarText = '';
  public snackbarColor = 'success';

  public showNotification(text: string, color: string = 'success'): void {
    this.snackbarText = text;
    this.snackbarColor = color;
    this.snackbar = true;
  }

  public getTimeSlot(day: any, hourIndex: number): any {
    return day.timeSlots[hourIndex];
  }

  public onTimeSlotClick(day: any, hourIndex: number): void {
    const timeSlot = this.getTimeSlot(day, hourIndex);
    if (timeSlot && timeSlot.available) {
      this.openAppointmentDialog(day.date, timeSlot.time);
    }
  }

  public async mounted(): Promise<void> {
    await super.mounted();
    this.$on('show-notification', this.showNotification);
  }
}
</script>

<style scoped>
.schedule-grid {
  overflow-x: auto;
}

.schedule-header {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
}

.time-column {
  width: 80px;
  min-width: 80px;
}

.day-header {
  flex: 1;
  min-width: 120px;
  padding: 16px 8px;
  text-align: center;
  border-left: 1px solid #e0e0e0;
}

.day-header.today {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: bold;
}

.day-name {
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.day-number {
  font-size: 18px;
  font-weight: bold;
}

.schedule-body {
  display: flex;
  flex-direction: column;
}

.time-row {
  display: flex;
  min-height: 80px;
  border-bottom: 1px solid #e0e0e0;
}

.time-label {
  width: 80px;
  min-width: 80px;
  padding: 8px;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e0e0e0;
}

.time-slot {
  flex: 1;
  min-width: 120px;
  border-left: 1px solid #e0e0e0;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
}

.time-slot.available:hover {
  background-color: #f5f5f5;
}

.time-slot.occupied {
  background-color: #fff3e0;
}

.appointment-card {
  padding: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 4px;
  margin: 4px;
}

.appointment-card.status-scheduled {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.appointment-card.status-confirmed {
  background-color: #e8f5e8;
  border-left: 4px solid #4caf50;
}

.appointment-card.status-completed {
  background-color: #f5f5f5;
  border-left: 4px solid #9e9e9e;
}

.appointment-card.status-cancelled {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
}

.appointment-client {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 2px;
}

.appointment-service {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.appointment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.empty-slot {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}

.empty-slot:hover {
  opacity: 0.7;
}

/* Dialog Styles */
.appointment-dialog {
  border-radius: 20px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  flex-shrink: 0;
}

.header-text {
  flex-grow: 1;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.step-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #e0e0e0;
  margin: 0 16px;
}

.form-section {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  background: #fafafa;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .day-header {
    min-width: 100px;
    padding: 12px 4px;
  }
  
  .time-slot {
    min-width: 100px;
  }
  
  .appointment-client {
    font-size: 11px;
  }
  
  .appointment-service {
    font-size: 10px;
  }

  .dialog-header {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .step-indicator {
    flex-direction: column;
    gap: 16px;
  }

  .step-line {
    width: 2px;
    height: 30px;
    margin: 0;
  }
}
</style>