<template>
  <sidebar-layout>
    <v-row class="mb-3">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 primary--text mb-1 font-weight-bold">Agenda</h1>
            <p class="text-subtitle-2 grey--text mb-0">
              {{ selectedDate ? `Agendamentos para ${formatSelectedDatePT}` : 'Clique em um dia para ver os agendamentos' }}
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" :lg="selectedDate ? '8' : '12'" :xl="selectedDate ? '9' : '12'">
        <v-card class="elevation-8" style="border-radius: 16px; overflow: hidden">
          <v-card-title class="primary white--text pa-4">
            <div class="d-flex align-center w-100">
              <div class="d-flex align-center">
                <v-icon color="white" size="24" class="mr-2">mdi-calendar-month</v-icon>
                <div>
                  <div class="text-h6 font-weight-bold">Agenda</div>
                  <div class="text-caption opacity-80">{{ totalAppointments }} agendamentos</div>
                </div>
              </div>
              
              <v-spacer />
              
              <div class="d-flex align-center">
                <v-btn 
                  icon 
                  color="white" 
                  @click="previousMonth" 
                  class="mr-1" 
                  style="background: rgba(255,255,255,0.1)"
                >
                  <v-icon size="20">mdi-chevron-left</v-icon>
                </v-btn>
                
                <div class="text-center mx-3" style="min-width: 160px">
                  <div class="text-subtitle-1 font-weight-bold">{{ currentMonthTitle }}</div>
                </div>
                
                <v-btn 
                  icon 
                  color="white" 
                  @click="nextMonth" 
                  class="mr-3"
                  style="background: rgba(255,255,255,0.1)"
                >
                  <v-icon size="20">mdi-chevron-right</v-icon>
                </v-btn>
                
                <v-btn 
                  color="white" 
                  class="primary--text font-weight-medium"
                  small
                  @click="goToToday"
                  style="border-radius: 6px"
                >
                  <v-icon left small color="primary">mdi-calendar-today</v-icon>
                  Hoje
                </v-btn>
              </div>
            </div>
          </v-card-title>
          
          <div class="pa-3" style="background: linear-gradient(135deg, #F8FAFC 0%, #E3F2FD 100%)">
            <div class="d-flex align-center justify-center">
              <v-chip small color="accent" dark class="mr-2 px-3">
                <v-icon left x-small>mdi-yoga</v-icon>
                Pilates
              </v-chip>
              <v-chip small color="success" dark class="px-3">
                <v-icon left x-small>mdi-medical-bag</v-icon>
                Fisioterapia
              </v-chip>
            </div>
          </div>

          <v-card-text class="pa-0">
            <div class="calendar-header d-flex">
              <div v-for="day in weekDays" :key="day" class="weekday-header">
                <div class="text-subtitle-1 font-weight-bold primary--text">{{ day }}</div>
              </div>
            </div>
            
            <div class="calendar-grid">
              <div 
                v-for="day in calendarDays" 
                :key="day.date"
                :class="getDayClasses(day)"
@click="selectDate(day.date)"
                class="calendar-day"
              >
                <div class="day-number-container">
                  <div :class="getDayNumberClasses(day)" class="day-number">
                    {{ day.dayNumber }}
                  </div>
                </div>
                
                <div v-if="getDayAppointments(day.date).length > 0" class="appointments-badge">
                  <v-chip 
                    x-small 
                    :color="getDayAppointments(day.date).length > 2 ? 'error' : 'success'"
                    dark
                    class="ma-1"
                  >
                    {{ getDayAppointments(day.date).length }}
                  </v-chip>
                </div>
                
                <div class="day-events">
                  <div 
                    v-for="(event, index) in getDayAppointments(day.date).slice(0, 2)" 
                    :key="event.id"
                    :style="{ backgroundColor: event.service === 'pilates' ? '#2196F3' : '#4CAF50' }"
                    class="event-item"
                    @click.stop="showEventDetails({ event })"
                  >
                    <v-icon x-small color="white" class="mr-1">
                      {{ event.service === 'pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                    </v-icon>
                    <span class="event-text">{{ event.time }}</span>
                    <span v-if="isAdmin && event.clientId" class="event-client">
                      {{ getClientName(event.clientId) }}
                    </span>
                  </div>
                  
                  <div v-if="getDayAppointments(day.date).length > 2" class="more-events">
                    <v-chip x-small color="grey" dark>
                      +{{ getDayAppointments(day.date).length - 2 }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4" xl="3" v-if="selectedDate">
        <v-card class="elevation-8 mb-4" style="border-radius: 16px">
          <v-card-title class="primary white--text pa-4">
            <div class="d-flex align-center w-100">
              <v-icon color="white" size="32" class="mr-3">mdi-calendar-today</v-icon>
              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold">{{ formatSelectedDatePT }}</div>
                <div class="text-caption opacity-90">{{ dayAppointments.length }} agendamentos</div>
              </div>
              <v-btn icon color="white" @click="selectedDate = ''" class="ml-2">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          
          <v-card-text class="pa-0">
            <div class="pa-4">
              <v-btn color="success" block large @click="openNewAppointment" style="border-radius: 12px">
                <v-icon left>mdi-plus</v-icon>
                Adicionar Agendamento
              </v-btn>
            </div>
            
            <v-divider />
            
            <v-list v-if="dayAppointments.length > 0">
              <v-list-item
                v-for="appointment in dayAppointments"
                :key="appointment.id"
                class="px-4 py-3"
              >
                <v-list-item-avatar size="40">
                  <v-avatar :color="appointment.service === 'pilates' ? 'accent' : 'success'" size="40">
                    <v-icon color="white" size="20">
                      {{ appointment.service === 'pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                    </v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-1 font-weight-bold primary--text">
                    {{ appointment.time }} - {{ appointment.service === 'pilates' ? 'Pilates' : 'Fisioterapia' }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-2">
                    {{ getProfessionalName(appointment.professionalId) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption" v-if="isAdmin && appointment.clientId">
                    Cliente: {{ getClientName(appointment.clientId) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="editAppointment(appointment)">
                        <v-list-item-icon>
                          <v-icon color="primary">mdi-pencil</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Editar</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteAppointment(appointment)">
                        <v-list-item-icon>
                          <v-icon color="error">mdi-delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Excluir</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            
            <v-card-text v-else class="text-center pa-6">
              <v-icon size="64" color="primary" class="mb-3 opacity-60">mdi-calendar-blank</v-icon>
              <p class="text-subtitle-1 primary--text mb-3">Nenhum agendamento para este dia</p>
              <v-btn color="success" @click="openNewAppointment" style="border-radius: 8px">
                <v-icon left>mdi-plus</v-icon>
                Adicionar Agendamento
              </v-btn>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="appointmentDialog" max-width="700px" persistent>
      <v-card style="border-radius: 16px">
        <v-card-title class="primary white--text pa-6">
          <v-icon left color="white" size="28">
            {{ editingAppointment ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <div class="text-h5 font-weight-bold">
            {{ editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento' }}
          </div>
          <v-spacer />
          <v-btn icon color="white" @click="closeAppointmentDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-stepper v-model="currentStep" vertical>
            <v-stepper-step :complete="currentStep > 1" step="1">
              Selecionar Serviço
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-row>
                <v-col cols="6" v-for="service in services" :key="service.value">
                  <v-card 
                    :color="appointmentForm.service === service.value ? 'primary' : 'grey lighten-4'"
                    :dark="appointmentForm.service === service.value"
                    @click="selectService(service.value)"
                    class="pa-8 text-center cursor-pointer service-card"
                    style="border-radius: 16px"
                  >
                    <v-icon size="56" class="mb-4">
                      {{ service.value === 'pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                    </v-icon>
                    <div class="text-h5 font-weight-bold">{{ service.text }}</div>
                  </v-card>
                </v-col>
              </v-row>
              <v-btn color="primary" large @click="nextStep" :disabled="!appointmentForm.service" class="mt-6">
                Continuar
              </v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="currentStep > 2" step="2">
              Selecionar Profissional
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-list>
                <v-list-item 
                  v-for="professional in filteredProfessionals" 
                  :key="professional.id"
                  @click="selectProfessional(professional.id)"
                  :class="appointmentForm.professionalId === professional.id ? 'primary white--text' : ''"
                  style="border-radius: 12px; margin-bottom: 12px"
                  class="professional-item pa-4"
                >
                  <v-list-item-avatar size="56">
                    <v-avatar :color="appointmentForm.service === 'pilates' ? 'accent' : 'success'" size="56">
                      <v-icon color="white" size="28">
                        {{ appointmentForm.service === 'pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                      </v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6 font-weight-bold">{{ professional.name }}</v-list-item-title>
                    <v-list-item-subtitle :class="appointmentForm.professionalId === professional.id ? 'white--text' : ''" class="text-subtitle-1">
                      {{ professional.specialty === 'pilates' ? 'Instrutor de Pilates' : 'Fisioterapeuta' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div class="d-flex mt-6">
                <v-btn text large @click="previousStep">Voltar</v-btn>
                <v-spacer />
                <v-btn color="primary" large @click="nextStep" :disabled="!appointmentForm.professionalId">
                  Continuar
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step :complete="currentStep > 3" step="3" v-if="isAdmin">
              Selecionar Cliente
            </v-stepper-step>
            <v-stepper-content step="3" v-if="isAdmin">
              <v-text-field
                v-model="clientSearch"
                label="Buscar cliente"
                prepend-inner-icon="mdi-magnify"
                outlined
                large
                class="mb-6"
              />
              <v-list max-height="350" style="overflow-y: auto">
                <v-list-item 
                  v-for="client in filteredClients" 
                  :key="client.id"
                  @click="selectClient(client.id)"
                  :class="appointmentForm.clientId === client.id ? 'primary white--text' : ''"
                  style="border-radius: 12px; margin-bottom: 8px"
                  class="pa-4"
                >
                  <v-list-item-avatar size="48">
                    <v-avatar color="primary" size="48">
                      <v-icon color="white" size="24">mdi-account</v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6 font-weight-bold">{{ client.name }}</v-list-item-title>
                    <v-list-item-subtitle :class="appointmentForm.clientId === client.id ? 'white--text' : ''" class="text-subtitle-1">
                      {{ client.email }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div class="d-flex mt-6">
                <v-btn text large @click="previousStep">Voltar</v-btn>
                <v-spacer />
                <v-btn color="primary" large @click="nextStep" :disabled="!appointmentForm.clientId">
                  Continuar
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step :complete="currentStep > (isAdmin ? 4 : 3)" :step="isAdmin ? 4 : 3">
              Selecionar Data e Horário
            </v-stepper-step>
            <v-stepper-content :step="isAdmin ? 4 : 3">
              <v-text-field
                v-model="appointmentForm.date"
                type="date"
                label="Data"
                outlined
                large
                class="mb-6"
              />
              
              <div class="mb-6">
                <div class="text-h6 font-weight-bold mb-4 primary--text">Horários Disponíveis:</div>
                <v-row>
                  <v-col cols="4" v-for="slot in availableTimeSlots" :key="slot.time">
                    <v-btn
                      :color="appointmentForm.time === slot.time ? 'success' : (slot.available ? 'grey lighten-2' : 'grey')"
                      :dark="appointmentForm.time === slot.time || !slot.available"
                      :disabled="!slot.available"
                      @click="selectTime(slot.time)"
                      block
                      large
                      class="mb-3 time-slot text-h6"
                      style="border-radius: 12px"
                    >
                      {{ slot.time }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              
              <div class="d-flex mt-6">
                <v-btn text large @click="previousStep">Voltar</v-btn>
                <v-spacer />
                <v-btn color="success" x-large @click="saveAppointment" :disabled="!canSaveAppointment" style="border-radius: 12px">
                  <v-icon left size="24">mdi-check</v-icon>
                  {{ editingAppointment ? 'Salvar Alterações' : 'Confirmar Agendamento' }}
                </v-btn>
              </div>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </sidebar-layout>
</template>

<script lang="ts">
import ScheduleController from './ScheduleController'
import SidebarLayout from '@/components/sidebarLayout.vue'

export default ScheduleController.extend({
  components: {
    SidebarLayout
  }
})
</script>

<style scoped>
/* Componentes gerais */
.cursor-pointer {
  cursor: pointer;
}

.service-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.15);
}

.professional-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.professional-item:hover {
  background-color: rgba(25, 118, 210, 0.08);
  transform: translateX(12px);
}

.time-slot {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.time-slot:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

/* Calendário customizado */
.calendar-header {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
  padding: 12px 0;
}

.weekday-header {
  flex: 1;
  text-align: center;
  color: white;
  font-weight: 600;
  padding: 6px;
  font-size: 14px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #E0E0E0;
}

.calendar-day {
  background: white;
  min-height: 90px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background-color: #F3F8FF;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
  z-index: 1;
}

.calendar-day.other-month {
  background-color: #FAFAFA;
  color: #BDBDBD;
}

.calendar-day.today {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border: 2px solid #1976D2;
}

.calendar-day.weekend {
  background-color: #FAFAFA;
}

.calendar-day.has-appointments {
  border-left: 4px solid #4CAF50;
}

.calendar-day.selected {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
  color: white;
}

.day-number-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  color: #424242;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.day-number.today-number {
  background-color: #1976D2;
  color: white;
  font-weight: 700;
}

.day-number.other-month-number {
  color: #BDBDBD;
}

.selected .day-number {
  color: white;
}

.appointments-badge {
  position: absolute;
  top: 4px;
  right: 4px;
}

.day-events {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.event-item {
  padding: 3px 4px;
  border-radius: 4px;
  color: white;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.event-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.event-text {
  font-weight: 700;
  margin-right: 4px;
}

.event-client {
  font-size: 10px;
  opacity: 0.9;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
}

.more-events {
  text-align: center;
  margin-top: 2px;
}

/* Responsividade */
@media (max-width: 960px) {
  .calendar-day {
    min-height: 80px;
    padding: 4px;
  }
  
  .day-number {
    font-size: 12px;
    width: 20px;
    height: 20px;
  }
  
  .event-item {
    font-size: 9px;
    padding: 2px 3px;
  }
  
  .weekday-header {
    padding: 4px;
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .calendar-day {
    min-height: 70px;
    padding: 3px;
  }
  
  .day-number {
    font-size: 11px;
    width: 18px;
    height: 18px;
  }
  
  .event-item {
    font-size: 8px;
    padding: 2px;
  }
  
  .event-text {
    display: none;
  }
  
  .weekday-header {
    padding: 3px;
    font-size: 11px;
  }
  
  .calendar-header {
    padding: 8px 0;
  }
}

@media (max-width: 400px) {
  .calendar-day {
    min-height: 55px;
    padding: 2px;
  }
  
  .day-number {
    font-size: 10px;
    width: 16px;
    height: 16px;
  }
  
  .event-item {
    padding: 1px;
    font-size: 7px;
  }
  
  .event-client {
    display: none;
  }
}
</style>