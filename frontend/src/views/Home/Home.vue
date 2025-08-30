<template>
  <sidebar-layout>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 primary--text mb-2">{{ greeting }}, {{ currentUser ? currentUser.name : 'Usuário' }}!</h1>
        <p class="text-subtitle-1 orange--text">{{ currentDate }}</p>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-4 text-center pa-6" color="primary" dark style="border-radius: 12px">
          <v-icon size="48" class="mb-3">mdi-calendar-check</v-icon>
          <div class="text-h3 font-weight-bold mb-1">{{ stats.todayAppointments }}</div>
          <div class="text-subtitle-1 opacity-90">Agendamentos Hoje</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-4 text-center pa-6" style="border-radius: 12px; background: linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)">
          <v-icon size="48" class="mb-3" color="primary">mdi-account-multiple</v-icon>
          <div class="text-h3 font-weight-bold mb-1 primary--text">{{ stats.activeClients }}</div>
          <div class="text-subtitle-1 orange--text">Clientes Ativos</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-4 text-center pa-6" color="accent" dark style="border-radius: 12px">
          <v-icon size="48" class="mb-3">mdi-yoga</v-icon>
          <div class="text-h3 font-weight-bold mb-1">{{ stats.totalAppointments }}</div>
          <div class="text-subtitle-1 opacity-90">Total Agendamentos</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-4 text-center pa-6" color="success" dark style="border-radius: 12px">
          <v-icon size="48" class="mb-3">mdi-medical-bag</v-icon>
          <div class="text-h3 font-weight-bold mb-1">R$ {{ stats.revenue }}</div>
          <div class="text-subtitle-1 opacity-90">Receita Mensal</div>
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
@click="navigateToSchedule()"
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
@click="navigateToSettings()"
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
          <v-list v-if="recentAppointments.length > 0" class="transparent">
            <v-list-item 
              v-for="appointment in recentAppointments.slice(0, 3)" 
              :key="appointment.id" 
              class="px-0 mb-2"
              style="border-radius: 8px; background: #F5F5F5"
            >
              <v-list-item-avatar size="48">
                <v-avatar :color="appointment.service === 'Pilates' ? 'accent' : 'success'" size="48">
                  <v-icon color="white" size="24">
                    {{ appointment.service === 'Pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                  </v-icon>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-subtitle-1 font-weight-bold primary--text">
                  {{ appointment.service }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-2">
                  {{ appointment.client }} às {{ appointment.time }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip :color="getStatusColor(appointment.status)" small dark>
                  {{ getStatusText(appointment.status) }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center pa-8">
            <v-icon size="64" color="primary" class="mb-4 opacity-60">mdi-calendar-blank</v-icon>
            <p class="text-h6 primary--text">Nenhum agendamento encontrado</p>
            <v-btn color="success" class="mt-4" @click="navigateToSchedule()">
              <v-icon left>mdi-plus</v-icon>
              Agendar Sessão
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


  </sidebar-layout>
</template>

<script lang="ts">
import HomeController from './HomeController'
import SidebarLayout from '@/components/sidebarLayout.vue'

export default HomeController.extend({
  components: {
    SidebarLayout
  }
})
</script>