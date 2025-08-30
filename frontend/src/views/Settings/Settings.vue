<template>
  <sidebar-layout>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 primary--text mb-2">Parametrizações</h1>
        <p class="text-subtitle-1 orange--text">Configure as opções do sistema</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="6">
        <v-card class="elevation-6 mb-6" style="border-radius: 16px">
          <v-card-title class="success white--text pa-6">
            <v-icon left color="white" size="24">mdi-medical-bag</v-icon>
            <div>
              <div class="text-h6 font-weight-bold">Tipos de Serviço</div>
              <div class="text-caption opacity-80">Gerencie os serviços oferecidos</div>
            </div>
            <v-spacer />
            <v-btn color="white" class="success--text" @click="openServiceDialog">
              <v-icon left>mdi-plus</v-icon>
              Novo Serviço
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-6">
            <v-list class="transparent">
              <v-list-item 
                v-for="service in services" 
                :key="service.id"
                class="mb-2 px-4 py-3"
                style="border-radius: 8px; background: #F8FAFC"
              >
                <v-list-item-avatar size="48">
                  <v-avatar :color="service.type === 'pilates' ? 'accent' : 'success'" size="48">
                    <v-icon color="white" size="24">
                      {{ service.type === 'pilates' ? 'mdi-yoga' : 'mdi-medical-bag' }}
                    </v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-1 font-weight-bold primary--text">
                    {{ service.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-2">
                    {{ service.sessions }} sessões
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" color="primary">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="editService(service)">
                        <v-list-item-icon>
                          <v-icon color="accent">mdi-pencil</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Editar</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteService(service)">
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
          </v-card-text>
        </v-card>

        <v-card class="elevation-6" style="border-radius: 16px">
          <v-card-title class="primary white--text pa-6">
            <v-icon left color="white" size="24">mdi-account-group</v-icon>
            <div>
              <div class="text-h6 font-weight-bold">Profissionais</div>
              <div class="text-caption opacity-80">Gerencie a equipe do studio</div>
            </div>
            <v-spacer />
            <v-btn color="white" class="primary--text" @click="openProfessionalDialog">
              <v-icon left>mdi-plus</v-icon>
              Novo Profissional
            </v-btn>
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
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" color="primary">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="editProfessional(professional)">
                        <v-list-item-icon>
                          <v-icon color="accent">mdi-pencil</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Editar</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteProfessional(professional)">
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
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6">
        <v-card class="elevation-6 mb-6" style="border-radius: 16px">
          <v-card-title class="accent white--text pa-6">
            <v-icon left color="white" size="24">mdi-clock</v-icon>
            <div>
              <div class="text-h6 font-weight-bold">Horários de Funcionamento</div>
              <div class="text-caption opacity-80">Configure os horários do studio</div>
            </div>
          </v-card-title>
          <v-card-text class="pa-6">
            <v-list class="transparent">
              <v-list-item 
                v-for="schedule in schedules" 
                :key="schedule.id"
                class="mb-2 px-4 py-3" 
                style="border-radius: 8px; background: #F8FAFC"
              >
                <v-list-item-avatar>
                  <v-avatar :color="schedule.type === 'weekday' ? 'primary' : 'success'" size="40">
                    <v-icon color="white" size="20">
                      {{ schedule.type === 'weekday' ? 'mdi-calendar-week' : 'mdi-calendar-weekend' }}
                    </v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-1 font-weight-bold primary--text">
                    {{ schedule.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-subtitle-2">
                    {{ schedule.startTime }} - {{ schedule.endTime }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon color="accent" @click="editSchedule(schedule)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card class="elevation-6" style="border-radius: 16px">
          <v-card-title class="orange white--text pa-6">
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
            <v-btn color="success" x-large block style="border-radius: 12px">
              <v-icon left size="20">mdi-content-save</v-icon>
              Salvar Configurações
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog Tipo de Serviço -->
    <v-dialog v-model="serviceDialog" max-width="600px" persistent>
      <v-card style="border-radius: 16px">
        <v-card-title class="success white--text pa-6">
          <v-icon left color="white" size="28">
            {{ editingService ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          <div class="text-h5 font-weight-bold">
            {{ editingService ? 'Editar Serviço' : 'Novo Serviço' }}
          </div>
          <v-spacer />
          <v-btn icon color="white" @click="closeServiceDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form ref="serviceForm" v-model="serviceValid">
            <v-text-field
              v-model="serviceForm.name"
              label="Nome do Serviço"
              prepend-inner-icon="mdi-medical-bag"
              outlined
              :rules="[rules.required]"
              class="mb-4"
            />
            <v-select
              v-model="serviceForm.type"
              :items="serviceTypes"
              label="Tipo de Serviço"
              prepend-inner-icon="mdi-format-list-bulleted"
              outlined
              :rules="[rules.required]"
              class="mb-4"
            />
            <v-text-field
              v-model="serviceForm.sessions"
              label="Quantidade de Sessões"
              prepend-inner-icon="mdi-counter"
              outlined
              type="number"
              :rules="[rules.required]"
              class="mb-4"
            />
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-btn text color="orange" @click="closeServiceDialog">
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn color="success" :disabled="!serviceValid" @click="saveService">
            <v-icon left>mdi-check</v-icon>
            {{ editingService ? 'Salvar Alterações' : 'Cadastrar Serviço' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Profissional -->
    <v-dialog v-model="professionalDialog" max-width="600px" persistent>
      <v-card style="border-radius: 16px">
        <v-card-title class="primary white--text pa-6">
          <v-icon left color="white" size="28">
            {{ editingProfessional ? 'mdi-pencil' : 'mdi-account-plus' }}
          </v-icon>
          <div class="text-h5 font-weight-bold">
            {{ editingProfessional ? 'Editar Profissional' : 'Novo Profissional' }}
          </div>
          <v-spacer />
          <v-btn icon color="white" @click="closeProfessionalDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form ref="professionalForm" v-model="professionalValid">
            <v-text-field
              v-model="professionalForm.name"
              label="Nome Completo"
              prepend-inner-icon="mdi-account"
              outlined
              :rules="[rules.required]"
              class="mb-4"
            />
            <v-select
              v-model="professionalForm.specialty"
              :items="specialties"
              label="Especialidade"
              prepend-inner-icon="mdi-medical-bag"
              outlined
              :rules="[rules.required]"
              class="mb-4"
            />
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-btn text color="orange" @click="closeProfessionalDialog">
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn color="primary" :disabled="!professionalValid" @click="saveProfessional">
            <v-icon left>mdi-check</v-icon>
            {{ editingProfessional ? 'Salvar Alterações' : 'Cadastrar Profissional' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Horário -->
    <v-dialog v-model="scheduleDialog" max-width="500px" persistent>
      <v-card style="border-radius: 16px">
        <v-card-title class="accent white--text pa-6">
          <v-icon left color="white" size="28">mdi-clock-edit</v-icon>
          <div class="text-h5 font-weight-bold">
            Editar Horário
          </div>
          <v-spacer />
          <v-btn icon color="white" @click="closeScheduleDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form ref="scheduleForm" v-model="scheduleValid">
            <v-text-field
              v-model="scheduleForm.name"
              label="Período"
              prepend-inner-icon="mdi-calendar"
              outlined
              readonly
              class="mb-4"
            />
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="scheduleForm.startTime"
                  label="Horário Inicial"
                  prepend-inner-icon="mdi-clock-start"
                  outlined
                  type="time"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="scheduleForm.endTime"
                  label="Horário Final"
                  prepend-inner-icon="mdi-clock-end"
                  outlined
                  type="time"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-btn text color="orange" @click="closeScheduleDialog">
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn color="accent" :disabled="!scheduleValid" @click="saveSchedule">
            <v-icon left>mdi-check</v-icon>
            Salvar Horário
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </sidebar-layout>
</template>

<script lang="ts">
import SettingsController from './SettingsController'
import SidebarLayout from '@/components/sidebarLayout.vue'

export default SettingsController.extend({
  components: {
    SidebarLayout
  }
})
</script>