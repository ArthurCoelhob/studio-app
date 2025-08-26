<template>
  <sidebar-layout>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 primary--text mb-2">Clientes</h1>
        <p class="text-subtitle-1 grey--text">Gerencie os clientes do studio</p>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-6 text-center pa-4" color="primary" dark style="border-radius: 12px">
          <v-icon size="40" class="mb-2">mdi-account-multiple</v-icon>
          <div class="text-h4 font-weight-bold">{{ totalClients }}</div>
          <div class="text-subtitle-2 opacity-90">Total de Clientes</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-6 text-center pa-4" color="success" dark style="border-radius: 12px">
          <v-icon size="40" class="mb-2">mdi-account-check</v-icon>
          <div class="text-h4 font-weight-bold">{{ activeClients }}</div>
          <div class="text-subtitle-2 opacity-90">Clientes Ativos</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-6 text-center pa-4" color="accent" dark style="border-radius: 12px">
          <v-icon size="40" class="mb-2">mdi-account-plus</v-icon>
          <div class="text-h4 font-weight-bold">{{ newClients }}</div>
          <div class="text-subtitle-2 opacity-90">Novos este Mês</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-6 text-center pa-4" color="secondary" dark style="border-radius: 12px">
          <v-icon size="40" class="mb-2">mdi-star</v-icon>
          <div class="text-h4 font-weight-bold">4.8</div>
          <div class="text-subtitle-2 opacity-90">Satisfação Média</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="elevation-6" style="border-radius: 16px">
          <v-card-title class="primary white--text pa-6">
            <v-icon left color="white" size="24">mdi-account-group</v-icon>
            <div>
              <div class="text-h6 font-weight-bold">Lista de Clientes</div>
              <div class="text-caption opacity-80">Gerencie informações dos clientes</div>
            </div>
            <v-spacer />
            <v-btn color="white" class="primary--text">
              <v-icon left>mdi-plus</v-icon>
              Novo Cliente
            </v-btn>
          </v-card-title>
          
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="clients"
              :items-per-page="10"
              class="elevation-0"
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar size="40" :color="item.active ? 'primary' : 'grey'">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
              </template>
              
              <template v-slot:item.status="{ item }">
                <v-chip :color="item.active ? 'success' : 'grey'" small dark>
                  {{ item.active ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </template>
              
              <template v-slot:item.lastVisit="{ item }">
                {{ formatDate(item.lastVisit) }}
              </template>
              
              <template v-slot:item.actions="{ item }">
                <v-btn icon color="primary" @click="viewClient(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon color="secondary" @click="editClient(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </sidebar-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SidebarLayout from '@/components/sidebarLayout.vue'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  active: boolean
  lastVisit: string
  totalSessions: number
}

@Component({
  components: {
    SidebarLayout
  }
})
export default class Clients extends Vue {
  headers = [
    { text: '', value: 'avatar', sortable: false, width: '60px' },
    { text: 'Nome', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Telefone', value: 'phone' },
    { text: 'Status', value: 'status', width: '100px' },
    { text: 'Última Visita', value: 'lastVisit' },
    { text: 'Sessões', value: 'totalSessions', width: '100px' },
    { text: 'Ações', value: 'actions', sortable: false, width: '120px' }
  ]

  clients: Client[] = [
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(11) 99999-9999',
      active: true,
      lastVisit: '2024-01-15',
      totalSessions: 24
    },
    {
      id: 2,
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '(11) 88888-8888',
      active: true,
      lastVisit: '2024-01-14',
      totalSessions: 18
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 77777-7777',
      active: false,
      lastVisit: '2023-12-20',
      totalSessions: 12
    }
  ]

  get totalClients() {
    return this.clients.length
  }

  get activeClients() {
    return this.clients.filter(c => c.active).length
  }

  get newClients() {
    return 5 // Mock data
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  viewClient(client: Client) {
    console.log('View client:', client)
  }

  editClient(client: Client) {
    console.log('Edit client:', client)
  }
}
</script>