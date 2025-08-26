<template>
  <v-card class="elevation-8" style="border-radius: 12px; overflow: hidden">
    <v-card-title class="primary white--text pa-6">
      <div class="d-flex align-center w-100">
        <v-icon left color="white" size="28">mdi-calendar-month</v-icon>
        <div>
          <div class="text-h5 font-weight-bold">{{ currentMonth }}</div>
          <div class="text-caption opacity-80">{{ totalEvents }} agendamentos</div>
        </div>
        <v-spacer />
        <div class="d-flex">
          <v-btn icon color="white" @click="previousMonth" class="mr-2">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon color="white" @click="nextMonth">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-title>

    <div class="pa-4 d-flex align-center" style="background: #F8FAFC">
      <v-btn-toggle v-model="type" mandatory class="mr-4">
        <v-btn small value="month" color="primary">
          <v-icon left small>mdi-calendar</v-icon>
          Mês
        </v-btn>
        <v-btn small value="week" color="primary">
          <v-icon left small>mdi-calendar-week</v-icon>
          Semana
        </v-btn>
        <v-btn small value="day" color="primary">
          <v-icon left small>mdi-calendar-today</v-icon>
          Dia
        </v-btn>
      </v-btn-toggle>
      
      <v-spacer />
      
      <div class="d-flex align-center">
        <v-chip small color="accent" class="mr-2">
          <v-icon left small>mdi-yoga</v-icon>
          Pilates
        </v-chip>
        <v-chip small color="success" class="mr-2">
          <v-icon left small>mdi-medical-bag</v-icon>
          Fisioterapia
        </v-chip>
      </div>
    </div>

    <v-card-text class="pa-0">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary"
        :events="calendarEvents"
        :event-color="getEventColor"
        :type="type"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="handleDateClick"
        @change="updateRange"
        event-overlap-mode="stack"
        :event-height="32"
      >
        <template v-slot:event="{ event }">
          <div class="pa-1 text-caption font-weight-medium" style="border-radius: 4px">
            <div class="d-flex align-center">
              <v-icon small class="mr-1" color="white">
                {{ event.service === 'Pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
              </v-icon>
              <span>{{ event.time }}</span>
            </div>
            <div class="text-truncate">{{ event.name }}</div>
          </div>
        </template>
      </v-calendar>

      <v-dialog v-model="selectedOpen" max-width="500px">
        <v-card style="border-radius: 12px">
          <v-card-title class="primary white--text pa-6">
            <v-icon left color="white" size="24">mdi-calendar-check</v-icon>
            <div>
              <div class="text-h6 font-weight-bold">{{ selectedEvent.name }}</div>
              <div class="text-caption opacity-80">Detalhes do Agendamento</div>
            </div>
            <v-spacer />
            <v-btn icon color="white" @click="selectedOpen = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="d-flex align-center mb-3">
                  <v-icon color="primary" class="mr-3">mdi-clock-outline</v-icon>
                  <div>
                    <div class="text-subtitle-2 grey--text">Horário</div>
                    <div class="text-subtitle-1 font-weight-medium">{{ selectedEvent.time }}</div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="d-flex align-center mb-3">
                  <v-icon color="primary" class="mr-3">mdi-account</v-icon>
                  <div>
                    <div class="text-subtitle-2 grey--text">Cliente</div>
                    <div class="text-subtitle-1 font-weight-medium">{{ selectedEvent.client }}</div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="d-flex align-center mb-3">
                  <v-icon color="primary" class="mr-3">
                    {{ selectedEvent.service === 'Pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                  </v-icon>
                  <div>
                    <div class="text-subtitle-2 grey--text">Serviço</div>
                    <div class="text-subtitle-1 font-weight-medium">{{ selectedEvent.service }}</div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="d-flex align-center mb-3">
                  <v-icon color="primary" class="mr-3">mdi-information</v-icon>
                  <div>
                    <div class="text-subtitle-2 grey--text">Status</div>
                    <v-chip small :color="getStatusColor(selectedEvent.status)">
                      {{ selectedEvent.status }}
                    </v-chip>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          
          <v-card-actions class="pa-6 pt-0">
            <v-spacer />
            <v-btn text color="grey" @click="selectedOpen = false">
              Fechar
            </v-btn>
            <v-btn color="primary" @click="selectedOpen = false">
              <v-icon left small>mdi-pencil</v-icon>
              Editar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Appointment } from '@/types'

interface CalendarEvent {
  name: string
  start: string
  end: string
  color: string
  time: string
  client: string
  service: string
  status: string
}

@Component
export default class CalendarView extends Vue {
  @Prop({ default: () => [] }) appointments!: Appointment[]

  focus = ''
  type = 'month'
  selectedEvent: any = {}
  selectedElement: any = null
  selectedOpen = false

  get currentMonth() {
    return new Date(this.focus || new Date()).toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  get totalEvents() {
    return this.calendarEvents.length
  }

  get calendarEvents(): CalendarEvent[] {
    return this.appointments.map(appointment => ({
      name: `${appointment.service === 'pilates' ? 'Pilates' : 'Fisioterapia'}`,
      start: `${appointment.date} ${appointment.time}`,
      end: `${appointment.date} ${this.addHour(appointment.time)}`,
      color: this.getServiceColor(appointment.service),
      time: appointment.time,
      client: 'Maria Silva',
      service: appointment.service === 'pilates' ? 'Pilates' : 'Fisioterapia',
      status: appointment.status
    }))
  }

  mounted() {
    this.focus = new Date().toISOString().substr(0, 10)
  }

  previousMonth() {
    const calendar = this.$refs.calendar as any
    if (calendar) calendar.prev()
  }

  nextMonth() {
    const calendar = this.$refs.calendar as any
    if (calendar) calendar.next()
  }

  showEvent({ nativeEvent, event }: any) {
    const open = () => {
      this.selectedEvent = event
      this.selectedElement = nativeEvent.target
      requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
    }

    if (this.selectedOpen) {
      this.selectedOpen = false
      requestAnimationFrame(() => requestAnimationFrame(() => open()))
    } else {
      open()
    }

    nativeEvent.stopPropagation()
  }

  viewDay({ date }: any) {
    this.focus = date
    this.type = 'day'
  }

  handleDateClick({ date }: any) {
    this.focus = date
    this.$emit('date-click', date)
  }

  updateRange() {
    
  }

  getEventColor(event: CalendarEvent) {
    return event.color
  }

  getServiceColor(service: string) {
    return service === 'pilates' ? 'accent' : 'success'
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'agendado': return 'success'
      case 'cancelado': return 'error'
      case 'concluido': return 'info'
      default: return 'grey'
    }
  }

  addHour(time: string) {
    const [hours, minutes] = time.split(':').map(Number)
    const newHours = (hours + 1) % 24
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
}
</script>