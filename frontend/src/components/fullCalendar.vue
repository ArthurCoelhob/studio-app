<template>
  <div class="full-calendar-container">
    <v-card class="elevation-4" style="border-radius: 12px; overflow: hidden">
      <v-card-title class="primary white--text pa-4">
        <v-icon left color="white" size="28">mdi-calendar-month</v-icon>
        <div>
          <div class="text-h5 font-weight-bold">Agenda do Studio</div>
          <div class="text-caption opacity-80">{{ totalEvents }} agendamentos</div>
        </div>
        <v-spacer />
        <v-btn-toggle v-model="currentView" mandatory class="mr-4">
          <v-btn small value="dayGridMonth" color="white" class="primary--text">
            Mês
          </v-btn>
          <v-btn small value="timeGridWeek" color="white" class="primary--text">
            Semana
          </v-btn>
          <v-btn small value="timeGridDay" color="white" class="primary--text">
            Dia
          </v-btn>
        </v-btn-toggle>
      </v-card-title>

      <div class="calendar-wrapper">
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
        />
      </div>
    </v-card>

    <v-dialog v-model="timeSlotDialog" max-width="600px">
      <v-card style="border-radius: 12px">
        <v-card-title class="primary white--text pa-6">
          <v-icon left color="white">mdi-clock-outline</v-icon>
          <div>
            <div class="text-h6 font-weight-bold">Horários Disponíveis</div>
            <div class="text-caption opacity-80">{{ formatSelectedDate }}</div>
          </div>
          <v-spacer />
          <v-btn icon color="white" @click="timeSlotDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-row>
            <v-col 
              v-for="slot in availableSlots" 
              :key="slot.time" 
              cols="6" 
              sm="4" 
              md="3"
            >
              <v-btn
                :color="slot.available ? 'success' : 'grey'"
                :disabled="!slot.available"
                block
                large
                @click="selectTimeSlot(slot)"
                class="mb-2"
                style="border-radius: 8px"
              >
                <v-icon left small>
                  {{ slot.available ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
                {{ slot.time }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="appointmentDialog" max-width="500px">
      <v-card style="border-radius: 12px">
        <v-card-title class="success white--text pa-6">
          <v-icon left color="white">mdi-plus-circle</v-icon>
          <div>
            <div class="text-h6 font-weight-bold">Novo Agendamento</div>
            <div class="text-caption opacity-80">{{ formatSelectedDate }} às {{ selectedTimeSlot }}</div>
          </div>
          <v-spacer />
          <v-btn icon color="white" @click="appointmentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form @submit.prevent="confirmAppointment">
            <v-select
              v-model="newAppointment.service"
              :items="services"
              label="Serviço"
              outlined
              prepend-inner-icon="mdi-medical-bag"
              color="primary"
              class="mb-4"
            />

            <v-select
              v-model="newAppointment.professionalId"
              :items="filteredProfessionals"
              item-text="name"
              item-value="id"
              label="Profissional"
              outlined
              prepend-inner-icon="mdi-account"
              color="primary"
              :disabled="!newAppointment.service"
              class="mb-4"
            />

            <v-card-actions class="pa-0 pt-4">
              <v-btn text color="grey" @click="appointmentDialog = false">
                Cancelar
              </v-btn>
              <v-spacer />
              <v-btn 
                color="success" 
                :disabled="!canConfirmAppointment"
                @click="confirmAppointment"
              >
                <v-icon left>mdi-check</v-icon>
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Appointment, Professional, TimeSlot } from '@/types'
import { MockService } from '@/services/mockService'

@Component({
  components: {
    FullCalendar
  }
})
export default class FullCalendarComponent extends Vue {
  @Prop({ default: () => [] }) appointments!: Appointment[]
  @Prop({ default: () => [] }) professionals!: Professional[]

  currentView = 'dayGridMonth'
  timeSlotDialog = false
  appointmentDialog = false
  selectedDate = ''
  selectedTimeSlot = ''
  availableSlots: TimeSlot[] = []
  
  newAppointment = {
    service: '',
    professionalId: null as number | null
  }

  services = [
    { text: 'Pilates', value: 'pilates' },
    { text: 'Fisioterapia', value: 'fisioterapia' }
  ]

  get calendarOptions() {
    return {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: this.currentView,
      headerToolbar: false,
      height: 'auto',
      locale: 'pt-br',
      firstDay: 1,
      events: this.calendarEvents,
      dateClick: this.handleDateClick,
      eventClick: this.handleEventClick,
      dayMaxEvents: 3,
      moreLinkClick: 'popover',
      eventDisplay: 'block',
      displayEventTime: true,
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    }
  }

  get calendarEvents() {
    return this.appointments.map(appointment => ({
      id: appointment.id.toString(),
      title: `${appointment.service === 'pilates' ? 'Pilates' : 'Fisioterapia'}`,
      start: `${appointment.date}T${appointment.time}`,
      backgroundColor: appointment.service === 'pilates' ? '#2196F3' : '#4CAF50',
      borderColor: appointment.service === 'pilates' ? '#1976D2' : '#388E3C',
      textColor: '#FFFFFF'
    }))
  }

  get totalEvents() {
    return this.appointments.length
  }

  get formatSelectedDate() {
    if (!this.selectedDate) return ''
    return new Date(this.selectedDate).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  get filteredProfessionals() {
    if (!this.newAppointment.service) return []
    return this.professionals.filter(p => p.specialty === this.newAppointment.service)
  }

  get canConfirmAppointment() {
    return this.newAppointment.service && this.newAppointment.professionalId
  }

  async handleDateClick(info: any) {
    this.selectedDate = info.dateStr
    this.availableSlots = await MockService.getTimeSlots()
    this.timeSlotDialog = true
  }

  handleEventClick(info: any) {
    console.log('Event clicked:', info.event)
  }

  selectTimeSlot(slot: TimeSlot) {
    if (!slot.available) return
    
    this.selectedTimeSlot = slot.time
    this.timeSlotDialog = false
    this.appointmentDialog = true
  }

  async confirmAppointment() {
    if (!this.canConfirmAppointment) return

    const currentUser = this.$store.getters.currentUser
    if (!currentUser) return

    const appointment: Appointment = {
      id: Date.now(),
      userId: currentUser.id,
      professionalId: this.newAppointment.professionalId!,
      service: this.newAppointment.service as 'pilates' | 'fisioterapia',
      date: this.selectedDate,
      time: this.selectedTimeSlot,
      status: 'agendado'
    }

    this.$emit('appointment-created', appointment)
    
    this.appointmentDialog = false
    this.newAppointment = { service: '', professionalId: null }
    
    this.$vuetify.theme.dark = false
    alert('Agendamento confirmado com sucesso!')
  }

  mounted() {
    this.$watch('currentView', (newView) => {
      const calendarApi = (this.$refs.fullCalendar as any).getApi()
      calendarApi.changeView(newView)
    })
  }
}
</script>

<style scoped>
.full-calendar-container {
  width: 100%;
}

.calendar-wrapper {
  padding: 16px;
  background: white;
}

::v-deep .fc {
  font-family: 'Roboto', sans-serif;
}

::v-deep .fc-toolbar {
  display: none;
}

::v-deep .fc-daygrid-day {
  min-height: 80px;
}

::v-deep .fc-daygrid-day.fc-day-today {
  background-color: #E3F2FD !important;
}

::v-deep .fc-daygrid-day-number {
  color: #1976D2;
  font-weight: 500;
  padding: 8px;
}

::v-deep .fc-event {
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin: 1px;
  padding: 2px 4px;
}

::v-deep .fc-daygrid-event {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .fc-more-link {
  color: #1976D2;
  font-weight: 500;
}
</style>