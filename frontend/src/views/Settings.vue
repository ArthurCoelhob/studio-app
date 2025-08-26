<template>
  <sidebar-layout>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 primary--text mb-2">Parametrizações</h1>
        <p class="text-subtitle-1 grey--text">Configure as opções do sistema</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="elevation-6 mb-6" style="border-radius: 16px">
          <v-card-title class="primary white--text pa-6">
            <v-icon left color="white" size="24">mdi-account-group</v-icon>
            <div>
              <div class="text-h6 font-weight-bold">Profissionais</div>
              <div class="text-caption opacity-80">Gerencie a equipe do studio</div>
            </div>
          </v-card-title>
          <v-card-text class="pa-6">
            <v-list class="transparent">
              <v-list-item 
                v-for="professional in professionals" 
                :key="professional.id"
                class="mb-2 px-4 py-3"
                style="border-radius: 8px; background: #F8FAFC"
              >
                <v-list-item-avatar size="48">
                  <v-avatar :color="professional.specialty === 'pilates' ? 'accent' : 'success'" size="48">
                    <v-icon color="white" size="24">
                      {{ professional.specialty === 'pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                    </v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-1 font-weight-bold primary--text">
                    {{ professional.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-2">
                    {{ professional.specialty === 'pilates' ? 'Pilates' : 'Fisioterapia' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon color="primary">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-btn color="primary" x-large block class="mt-4" style="border-radius: 12px">
              <v-icon left size="20">mdi-plus</v-icon>
              Adicionar Profissional
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="elevation-6 mb-6" style="border-radius: 16px">
          <v-card-title class="secondary white--text pa-6">
            <v-icon left color="white" size="24">mdi-clock</v-icon>
            <div>
              <div class="text-h6 font-weight-bold">Horários de Funcionamento</div>
              <div class="text-caption opacity-80">Configure os horários do studio</div>
            </div>
          </v-card-title>
          <v-card-text class="pa-6">
            <v-list class="transparent">
              <v-list-item class="mb-2 px-4 py-3" style="border-radius: 8px; background: #F8FAFC">
                <v-list-item-avatar>
                  <v-avatar color="secondary" size="40">
                    <v-icon color="white" size="20">mdi-calendar-week</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-1 font-weight-bold primary--text">
                    Segunda a Sexta
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-2">08:00 - 18:00</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon color="secondary">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item class="mb-2 px-4 py-3" style="border-radius: 8px; background: #F8FAFC">
                <v-list-item-avatar>
                  <v-avatar color="accent" size="40">
                    <v-icon color="white" size="20">mdi-calendar-weekend</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-1 font-weight-bold primary--text">
                    Sábado
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-2">08:00 - 12:00</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon color="accent">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card class="elevation-6" style="border-radius: 16px">
          <v-card-title class="accent white--text pa-6">
            <v-icon left color="white" size="24">mdi-cog</v-icon>
            <div>
              <div class="text-h6 font-weight-bold">Configurações Gerais</div>
              <div class="text-caption opacity-80">Personalize o funcionamento</div>
            </div>
          </v-card-title>
          <v-card-text class="pa-6">
            <div class="mb-4 pa-4" style="border-radius: 8px; background: #F8FAFC">
              <v-switch
                v-model="notifications"
                label="Notificações por email"
                color="primary"
                class="mb-2"
              />
              <v-switch
                v-model="autoConfirm"
                label="Confirmação automática"
                color="primary"
                class="mb-2"
              />
            </div>
            <v-text-field
              v-model="sessionDuration"
              label="Duração da sessão (minutos)"
              type="number"
              outlined
              dense
              color="primary"
              class="mb-4"
            />
            <v-btn color="accent" x-large block style="border-radius: 12px">
              <v-icon left size="20">mdi-content-save</v-icon>
              Salvar Configurações
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </sidebar-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Professional } from '@/types'
import { MockService } from '@/services/mockService'
import SidebarLayout from '@/components/sidebarLayout.vue'

@Component({
  components: {
    SidebarLayout
  }
})
export default class Settings extends Vue {
  professionals: Professional[] = []
  notifications = true
  autoConfirm = false
  sessionDuration = 60

  async mounted() {
    this.professionals = await MockService.getProfessionals()
  }
}
</script>