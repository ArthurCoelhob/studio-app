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
        <v-card class="elevation-6 text-center pa-4" color="accent" dark style="border-radius: 12px">
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
            <v-btn color="white" class="primary--text" @click="openClientDialog">
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
                <v-avatar size="40" :color="item.active ? 'primary' : 'orange'">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
              </template>
              
              <template v-slot:item.status="{ item }">
                <v-chip :color="item.active ? 'success' : 'orange'" small dark>
                  {{ item.active ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </template>
              
              <template v-slot:item.frequency="{ item }">
                {{ item.frequency }}x/semana
              </template>
              
              <template v-slot:item.actions="{ item }">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" color="primary">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="viewClient(item)">
                      <v-list-item-icon>
                        <v-icon color="primary">mdi-eye</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Visualizar</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="editClient(item)">
                      <v-list-item-icon>
                        <v-icon color="accent">mdi-pencil</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="toggleClientStatus(item)">
                      <v-list-item-icon>
                        <v-icon :color="item.active ? 'orange' : 'success'">
                          {{ item.active ? 'mdi-account-off' : 'mdi-account-check' }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>
                        {{ item.active ? 'Inativar' : 'Ativar' }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteClient(item)">
                      <v-list-item-icon>
                        <v-icon color="error">mdi-delete</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Excluir</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="clientDialog" max-width="800px" persistent>
      <v-card style="border-radius: 16px">
        <v-card-title class="primary white--text pa-6">
          <v-icon left color="white" size="28">
            {{ editingClient ? 'mdi-pencil' : 'mdi-account-plus' }}
          </v-icon>
          <div class="text-h5 font-weight-bold">
            {{ editingClient ? 'Editar Cliente' : 'Novo Cliente' }}
          </div>
          <v-spacer />
          <v-btn icon color="white" @click="closeClientDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.name"
                  label="Nome Completo"
                  prepend-inner-icon="mdi-account"
                  outlined
                  :rules="[rules.required]"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.cpf"
                  label="CPF"
                  prepend-inner-icon="mdi-card-account-details"
                  outlined
                  :rules="[rules.required, rules.cpf]"
                  v-mask="'###.###.###-##'"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.email"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  outlined
                  :rules="[rules.required, rules.email]"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.phone"
                  label="Telefone"
                  prepend-inner-icon="mdi-phone"
                  outlined
                  :rules="[rules.required]"
                  v-mask="'(##) #####-####'"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="clientForm.address"
                  label="Endereço Completo"
                  prepend-inner-icon="mdi-map-marker"
                  outlined
                  :rules="[rules.required]"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="clientForm.frequency"
                  :items="frequencyOptions"
                  label="Frequência Semanal"
                  prepend-inner-icon="mdi-calendar-week"
                  outlined
                  :rules="[rules.required]"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="clientForm.active"
                  label="Cliente Ativo"
                  color="success"
                  class="mb-4"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-btn text color="orange" @click="closeClientDialog">
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn color="success" :disabled="!valid" @click="saveClient">
            <v-icon left>mdi-check</v-icon>
            {{ editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </sidebar-layout>
</template>

<script lang="ts">
import ClientsController from './ClientsController'
import SidebarLayout from '@/components/sidebarLayout.vue'

export default ClientsController.extend({
  components: {
    SidebarLayout
  }
})
</script>