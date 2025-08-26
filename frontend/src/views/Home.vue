<template>
  <sidebar-layout>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 primary--text mb-2">Dashboard</h1>
        <p class="text-subtitle-1 grey--text">Bem-vindo ao seu painel de controle</p>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-4 text-center pa-6" color="primary" dark style="border-radius: 12px">
          <v-icon size="48" class="mb-3">mdi-calendar-check</v-icon>
          <div class="text-h3 font-weight-bold mb-1">{{ totalAppointments }}</div>
          <div class="text-subtitle-1 opacity-90">Agendamentos Hoje</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-4 text-center pa-6" style="border-radius: 12px; background: linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)">
          <v-icon size="48" class="mb-3" color="primary">mdi-account-multiple</v-icon>
          <div class="text-h3 font-weight-bold mb-1 primary--text">{{ totalClients }}</div>
          <div class="text-subtitle-1 grey--text">Clientes Ativos</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-4 text-center pa-6" color="accent" dark style="border-radius: 12px">
          <v-icon size="48" class="mb-3">mdi-yoga</v-icon>
          <div class="text-h3 font-weight-bold mb-1">{{ pilatesCount }}</div>
          <div class="text-subtitle-1 opacity-90">Sessões Pilates</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-4 text-center pa-6" color="success" dark style="border-radius: 12px">
          <v-icon size="48" class="mb-3">mdi-medical-bag</v-icon>
          <div class="text-h3 font-weight-bold mb-1">{{ physioCount }}</div>
          <div class="text-subtitle-1 opacity-90">Fisioterapia</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="elevation-4 pa-6" style="border-radius: 12px">
          <v-card-title class="text-h5 mb-4 primary--text">
            <v-icon large class="mr-3" color="primary">mdi-lightning-bolt</v-icon>
            Ações Rápidas
          </v-card-title>
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn
                color="primary"
                x-large
                block
                @click="$router.push('/agenda')"
                class="text-subtitle-1 py-8 mb-3"
                style="border-radius: 8px"
              >
                <v-icon left size="20">mdi-calendar-month</v-icon>
                Ver Agenda
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" v-if="currentUser && currentUser.role === 'admin'">
              <v-btn
                color="success"
                x-large
                block
                @click="$router.push('/settings')"
                class="text-subtitle-1 py-8 mb-3"
                style="border-radius: 8px"
              >
                <v-icon left size="20">mdi-cog</v-icon>
                Configurações
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" v-if="currentUser && currentUser.role === 'client'">
        <v-card class="elevation-4 pa-6" style="border-radius: 12px">
          <v-card-title class="text-h5 mb-4 primary--text">
            <v-icon large class="mr-3" color="primary">mdi-clock-outline</v-icon>
            Próximos Agendamentos
          </v-card-title>
          <v-list v-if="appointments.length > 0" class="transparent">
            <v-list-item 
              v-for="appointment in appointments.slice(0, 3)" 
              :key="appointment.id" 
              class="px-0 mb-2"
              style="border-radius: 8px; background: #F5F5F5"
            >
              <v-list-item-avatar size="48">
                <v-avatar :color="appointment.service === 'pilates' ? 'accent' : 'success'" size="48">
                  <v-icon color="white" size="24">
                    {{ appointment.service === 'pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                  </v-icon>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold primary--text">
                  {{ appointment.service === 'pilates' ? 'Pilates' : 'Fisioterapia' }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-2">
                  {{ formatDate(appointment.date) }} às {{ appointment.time }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip :color="getStatusColor(appointment.status)" small dark>
                  {{ appointment.status }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center pa-8">
            <v-icon size="64" color="primary" class="mb-4 opacity-60">mdi-calendar-blank</v-icon>
            <p class="text-h6 primary--text">Nenhum agendamento encontrado</p>
            <v-btn color="success" class="mt-4" @click="$router.push('/agenda')">
              <v-icon left>mdi-plus</v-icon>
              Agendar Sessão
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="currentUser && currentUser.role === 'admin'">
      <v-col cols="12">
        <v-card class="elevation-4 pa-6" style="border-radius: 12px">
          <v-card-title class="text-h5 mb-4 primary--text">
            <v-icon large class="mr-3" color="primary">mdi-chart-line</v-icon>
            Resumo da Semana
          </v-card-title>
          <v-row>
            <v-col cols="12" md="4">
              <div class="text-center pa-4" style="background: #F5F5F5; border-radius: 8px">
                <v-icon size="36" color="primary" class="mb-2">mdi-trending-up</v-icon>
                <div class="text-h4 font-weight-bold primary--text">85%</div>
                <div class="text-subtitle-2 grey--text">Taxa de Ocupação</div>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-center pa-4" style="background: #F5F5F5; border-radius: 8px">
                <v-icon size="36" color="success" class="mb-2">mdi-cash</v-icon>
                <div class="text-h4 font-weight-bold success--text">R$ 2.450</div>
                <div class="text-subtitle-2 grey--text">Receita Semanal</div>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-center pa-4" style="background: #F5F5F5; border-radius: 8px">
                <v-icon size="36" color="accent" class="mb-2">mdi-star</v-icon>
                <div class="text-h4 font-weight-bold accent--text">4.8</div>
                <div class="text-subtitle-2 grey--text">Avaliação Média</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </sidebar-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Appointment } from '@/types'
import { MockService } from '@/services/mockService'
import SidebarLayout from '@/components/sidebarLayout.vue'

@Component({
  components: {
    SidebarLayout
  }
})
export default class Home extends Vue {
  appointments: Appointment[] = []

  get currentUser() {
    return this.$store.getters.currentUser
  }

  get totalAppointments() {
    return this.currentUser && this.currentUser.role === 'admin' ? 12 : this.appointments.length
  }

  get totalClients() {
    return 45
  }

  get pilatesCount() {
    return 8
  }

  get physioCount() {
    return 4
  }

  async mounted() {
    if (this.currentUser && this.currentUser.role === 'client') {
      this.appointments = await MockService.getUserAppointments(this.currentUser.id)
    }
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR')
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