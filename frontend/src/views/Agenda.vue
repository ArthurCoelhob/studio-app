<template>
  <sidebar-layout>
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h3 primary--text mb-1 font-weight-bold">Agenda</h1>
            <p class="text-subtitle-1 grey--text mb-0">Gerencie seus agendamentos de forma visual e intuitiva</p>
          </div>
          <v-btn color="success" large class="hidden-sm-and-down" style="border-radius: 8px">
            <v-icon left>mdi-plus</v-icon>
            Novo Agendamento
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="9" xl="10">
        <full-calendar 
          :appointments="userAppointments" 
          :professionals="professionals"
          @appointment-created="handleAppointmentCreated"
        />
      </v-col>

      <v-col cols="12" lg="3" xl="2">
        <v-card class="elevation-4 mb-4" style="border-radius: 12px">
          <v-card-title class="primary white--text pa-4">
            <v-icon left color="white" size="20">mdi-chart-pie</v-icon>
            <div class="text-subtitle-1 font-weight-bold">Resumo</div>
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="text-center mb-3">
              <div class="text-h4 font-weight-bold primary--text">{{ userAppointments.length }}</div>
              <div class="text-caption grey--text">Total de Agendamentos</div>
            </div>
            <v-divider class="mb-3" />
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center">
                <v-icon small color="accent" class="mr-2">mdi-yoga</v-icon>
                <span class="text-caption">Pilates</span>
              </div>
              <span class="text-caption font-weight-bold">{{ pilatesCount }}</span>
            </div>
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <v-icon small color="success" class="mr-2">mdi-medical-bag</v-icon>
                <span class="text-caption">Fisioterapia</span>
              </div>
              <span class="text-caption font-weight-bold">{{ physioCount }}</span>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="elevation-4" style="border-radius: 12px">
          <v-card-title class="success white--text pa-4">
            <v-icon left color="white" size="20">mdi-calendar-check</v-icon>
            <div class="text-subtitle-1 font-weight-bold">Próximos</div>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list v-if="userAppointments.length > 0" dense>
              <v-list-item
                v-for="appointment in userAppointments.slice(0, 4)"
                :key="appointment.id"
                class="px-4 py-2"
              >
                <v-list-item-avatar size="32">
                  <v-avatar :color="appointment.service === 'pilates' ? 'accent' : 'success'" size="32">
                    <v-icon color="white" size="16">
                      {{ appointment.service === 'pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                    </v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-caption font-weight-bold primary--text">
                    {{ appointment.service === 'pilates' ? 'Pilates' : 'Fisio' }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    {{ formatShortDate(appointment.date) }} {{ appointment.time }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-text v-else class="text-center pa-4">
              <v-icon size="48" color="grey lighten-1" class="mb-2">mdi-calendar-blank</v-icon>
              <p class="text-caption grey--text mb-0">Nenhum agendamento</p>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </sidebar-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Professional, Appointment } from '@/types'
import { MockService } from '@/services/mockService'
import SidebarLayout from '@/components/sidebarLayout.vue'
import FullCalendar from '@/components/fullCalendar.vue'

@Component({
  components: {
    SidebarLayout,
    FullCalendar
  }
})
export default class Agenda extends Vue {
  professionals: Professional[] = []
  userAppointments: Appointment[] = []

  get currentUser() {
    return this.$store.getters.currentUser
  }

  get pilatesCount() {
    return this.userAppointments.filter(a => a.service === 'pilates').length
  }

  get physioCount() {
    return this.userAppointments.filter(a => a.service === 'fisioterapia').length
  }

  async mounted() {
    this.professionals = await MockService.getProfessionals()
    
    if (this.currentUser) {
      this.userAppointments = await MockService.getUserAppointments(this.currentUser.id)
    }
  }

  handleAppointmentCreated(appointment: Appointment) {
    this.userAppointments.push(appointment)
    this.$store.dispatch('addAppointment', appointment)
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  formatShortDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  getProfessionalName(id: number) {
    const professional = this.professionals.find(p => p.id === id)
    return professional?.name || 'Profissional não encontrado'
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'agendado': return 'success'
      case 'cancelado': return 'error'
      case 'concluido': return 'info'
      default: return 'grey'
    }
  }
}
</script>