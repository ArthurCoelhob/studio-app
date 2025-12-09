<template>
  <sidebar-layout>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 primary--text mb-2">Parametrizações</h1>
        <p class="text-subtitle-1 secondary--text">Configure as opções do sistema</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-model="expandedPanels" multiple class="mb-4">
          <!-- Tipos de Serviço -->
          <v-expansion-panel>
            <v-expansion-panel-header class="primary white--text pa-4" style="min-height: 80px">
              <div class="d-flex align-center w-100">
                <v-icon color="white" size="28" class="mr-4">mdi-medical-bag</v-icon>
                <div class="flex-grow-1">
                  <div class="text-h6 font-weight-bold">Tipos de Serviço</div>
                  <div class="text-caption opacity-90">{{ serviceController.services.length }} serviços cadastrados</div>
                </div>
                <v-btn 
                  color="white" 
                  class="primary--text mr-4" 
                  @click.stop="openServiceDialog"
                  small
                >
                  <v-icon left small>mdi-plus</v-icon>
                  Novo
                </v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list class="transparent pa-2">
                <v-list-item 
                  v-for="service in serviceController.services" 
                  :key="service.id"
                  class="mb-2 px-4 py-3"
                  style="border-radius: 8px; background: #F8FAFC"
                >
                  <v-list-item-avatar size="48">
                    <v-avatar color="primary" size="48">
                      <v-icon color="white" size="24">
                        mdi-medical-bag
                      </v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-subtitle-1 font-weight-bold success--text">
                      {{ service.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-subtitle-2">
                      {{ service.sessionCount }} sessões
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
                            <v-icon color="success">mdi-pencil</v-icon>
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
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Profissionais -->
          <v-expansion-panel>
            <v-expansion-panel-header class="cyan darken-3 white--text pa-4" style="min-height: 80px">
              <div class="d-flex align-center w-100">
                <v-icon color="white" size="28" class="mr-4">mdi-account-group</v-icon>
                <div class="flex-grow-1">
                  <div class="text-h6 font-weight-bold">Profissionais</div>
                  <div class="text-caption opacity-90">{{ professionalController.professionals.length }} profissionais cadastrados</div>
                </div>
                <v-btn 
                  color="white" 
                  class="cyan--text text--darken-3 mr-4" 
                  @click.stop="openProfessionalDialog"
                  small
                >
                  <v-icon left small>mdi-plus</v-icon>
                  Novo
                </v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list class="transparent pa-2">
                <v-list-item 
                  v-for="professional in professionalController.professionals" 
                  :key="professional.id"
                  class="mb-2 px-4 py-3"
                  style="border-radius: 8px; background: #F8FAFC"
                >
                  <v-list-item-avatar size="48">
                    <v-avatar :color="professional.profile === 'admin' ? 'cyan darken-4' : 'cyan darken-3'" size="48">
                      <v-icon color="white" size="24">
                        {{ professional.profile === 'admin' ? 'mdi-account-star' : 'mdi-account' }}
                      </v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-subtitle-1 font-weight-bold cyan--text text--darken-3">
                      {{ professional.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-subtitle-2">
                      {{ professionalController.getProfileText(professional.profile) }} - {{ professionalController.getServiceTypeName(professional.serviceTypeId) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" color="cyan darken-3">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="editProfessional(professional)">
                          <v-list-item-icon>
                            <v-icon color="primary">mdi-pencil</v-icon>
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
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- Horários de Funcionamento -->
          <v-expansion-panel>
            <v-expansion-panel-header class="teal lighten-2 white--text pa-4" style="min-height: 80px">
              <div class="d-flex align-center w-100">
                <v-icon color="white" size="28" class="mr-4">mdi-clock</v-icon>
                <div class="flex-grow-1">
                  <div class="text-h6 font-weight-bold">Horários de Funcionamento</div>
                  <div class="text-caption opacity-90">{{ businessHoursController.businessHours.length }} períodos configurados</div>
                </div>
                <v-btn 
                  color="white" 
                  class="accent--text mr-4" 
                  @click.stop="openBusinessHourDialog"
                  small
                >
                  <v-icon left small>mdi-plus</v-icon>
                  Novo
                </v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-if="businessHoursController.selectedBusinessHours.length > 0" class="pa-4 mb-2" style="background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); border-radius: 8px; border-left: 4px solid #00897b">
                <div class="d-flex align-center">
                  <v-icon color="accent" class="mr-2">mdi-checkbox-multiple-marked</v-icon>
                  <span class="text-subtitle-2 font-weight-bold accent--text mr-4">
                    {{ businessHoursController.selectedBusinessHours.length }} selecionado(s)
                  </span>
                  <v-btn small color="accent" class="mr-2 white--text" @click="editMultipleBusinessHours">
                    <v-icon left small>mdi-pencil</v-icon>
                    Editar
                  </v-btn>
                  <v-btn small color="error" @click="deleteMultipleBusinessHours">
                    <v-icon left small>mdi-delete</v-icon>
                    Excluir
                  </v-btn>
                  <v-spacer />
                  <v-btn small text color="accent" @click="businessHoursController.clearSelection()">
                    <v-icon left small>mdi-close</v-icon>
                    Limpar
                  </v-btn>
                </div>
              </div>
              <v-list class="transparent pa-2">
                <v-list-item 
                  v-for="businessHour in businessHoursController.businessHours" 
                  :key="businessHour.id"
                  class="mb-2 px-4 py-3" 
                  style="border-radius: 8px; background: #F8FAFC"
                >
                  <v-list-item-action class="mr-3">
                    <v-checkbox
                      :value="businessHour"
                      v-model="businessHoursController.selectedBusinessHours"
                      color="accent"
                      hide-details
                    />
                  </v-list-item-action>
                  <v-list-item-avatar>
                    <v-avatar color="accent" size="40">
                      <v-icon color="white" size="20">
                        mdi-calendar-week
                      </v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-subtitle-1 font-weight-bold accent--text">
                      {{ businessHoursController.getDayName(businessHour.dayOfWeek) }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-subtitle-2">
                      {{ businessHour.startTime }} - {{ businessHour.endTime }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" color="accent">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="editBusinessHour(businessHour)">
                          <v-list-item-icon>
                            <v-icon color="accent">mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Editar</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteBusinessHour(businessHour)">
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
            </v-expansion-panel-content>
          </v-expansion-panel>


        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- Dialog Tipo de Serviço -->
    <v-dialog v-model="serviceController.serviceDialog" max-width="700px" persistent>
      <v-card class="service-dialog" elevation="24">
        <!-- Header Gradient -->
        <div class="dialog-header service-header">
          <div class="header-content">
            <div class="header-icon">
              <v-avatar size="56" :color="serviceController.editingService ? 'warning' : 'success'" class="elevation-4">
                <v-icon size="28" color="white">
                  {{ serviceController.editingService ? 'mdi-pencil' : 'mdi-plus-circle' }}
                </v-icon>
              </v-avatar>
            </div>
            <div class="header-text">
              <h2 class="text-h5 font-weight-bold white--text mb-1">
                {{ serviceController.editingService ? 'Editar Serviço' : 'Novo Serviço' }}
              </h2>
              <p class="text-subtitle-1 white--text opacity-90 mb-0">
                {{ serviceController.editingService ? 'Modifique os dados do serviço' : 'Preencha os dados para o novo serviço' }}
              </p>
            </div>
            <v-btn icon color="white" @click="closeServiceDialog" class="ml-auto">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Form Content -->
        <v-card-text class="pa-8">
          <v-form ref="serviceForm" v-model="serviceController.serviceValid">
            <!-- Dados do Serviço Section -->
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="primary" class="mr-2">mdi-medical-bag</v-icon>
                Dados do Serviço
              </h3>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="serviceController.serviceForm.name"
                    label="Nome do Serviço"
                    prepend-inner-icon="mdi-medical-bag"
                    outlined
                    dense
                    :rules="[serviceController.rules.required]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="serviceController.serviceForm.sessionCount"
                    label="Quantidade de Sessões"
                    prepend-inner-icon="mdi-counter"
                    outlined
                    dense
                    type="number"
                    :rules="[serviceController.rules.required]"
                  />
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-card-text>
        
        <!-- Actions -->
        <v-card-actions class="pa-8 pt-0">
          <v-btn 
            text 
            color="grey" 
            @click="closeServiceDialog"
            class="px-6"
          >
            <v-icon left>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn 
            color="primary" 
            :disabled="!serviceController.serviceValid" 
            @click="saveService"
            class="px-8 py-2 white--text"
            elevation="2"
          >
            <v-icon left>{{ serviceController.editingService ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
            {{ serviceController.editingService ? 'Salvar Alterações' : 'Criar Serviço' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Profissional -->
    <v-dialog v-model="professionalController.professionalDialog" max-width="700px" persistent>
      <v-card class="professional-dialog" elevation="24">
        <!-- Header Gradient -->
        <div class="dialog-header professional-header">
          <div class="header-content">
            <div class="header-icon">
              <v-avatar size="56" :color="professionalController.editingProfessional ? 'warning' : 'primary'" class="elevation-4">
                <v-icon size="28" color="white">
                  {{ professionalController.editingProfessional ? 'mdi-pencil' : 'mdi-account-plus' }}
                </v-icon>
              </v-avatar>
            </div>
            <div class="header-text">
              <h2 class="text-h5 font-weight-bold white--text mb-1">
                {{ professionalController.editingProfessional ? 'Editar Profissional' : 'Novo Profissional' }}
              </h2>
              <p class="text-subtitle-1 white--text opacity-90 mb-0">
                {{ professionalController.editingProfessional ? 'Modifique os dados do profissional' : 'Preencha os dados para o novo profissional' }}
              </p>
            </div>
            <v-btn icon color="white" @click="closeProfessionalDialog" class="ml-auto">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Form Content -->
        <v-card-text class="pa-8">
          <v-form ref="professionalForm" v-model="professionalController.professionalValid">
            <!-- Dados Pessoais Section -->
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="primary" class="mr-2">mdi-account-circle</v-icon>
                Dados Pessoais
              </h3>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="professionalController.professionalForm.name"
                    label="Nome Completo"
                    prepend-inner-icon="mdi-account"
                    outlined
                    dense
                    :rules="[professionalController.rules.required]"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Configurações Profissionais Section -->
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="primary" class="mr-2">mdi-briefcase</v-icon>
                Configurações Profissionais
              </h3>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="professionalController.professionalForm.serviceTypeId"
                    :items="professionalController.serviceTypes"
                    item-text="name"
                    item-value="id"
                    label="Tipo de Serviço"
                    prepend-inner-icon="mdi-medical-bag"
                    outlined
                    dense
                    :rules="[professionalController.rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="professionalController.professionalForm.profile"
                    :items="professionalController.profileOptions"
                    item-text="text"
                    item-value="value"
                    label="Perfil"
                    prepend-inner-icon="mdi-account-star"
                    outlined
                    dense
                    :rules="[professionalController.rules.required]"
                  />
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-card-text>
        
        <!-- Actions -->
        <v-card-actions class="pa-8 pt-0">
          <v-btn 
            text 
            color="grey" 
            @click="closeProfessionalDialog"
            class="px-6"
          >
            <v-icon left>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn 
            color="cyan darken-3" 
            :disabled="!professionalController.professionalValid" 
            @click="saveProfessional"
            class="px-8 py-2 white--text"
            elevation="2"
          >
            <v-icon left>{{ professionalController.editingProfessional ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
            {{ professionalController.editingProfessional ? 'Salvar Alterações' : 'Criar Profissional' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Horário -->
    <v-dialog v-model="businessHoursController.businessHourDialog" max-width="600px" persistent>
      <v-card class="business-hour-dialog" elevation="24">
        <!-- Header Gradient -->
        <div class="dialog-header business-hour-header">
          <div class="header-content">
            <div class="header-icon">
              <v-avatar size="56" :color="businessHoursController.editingBusinessHour ? 'warning' : 'accent'" class="elevation-4">
                <v-icon size="28" color="white">
                  {{ businessHoursController.editingBusinessHour ? 'mdi-pencil' : 'mdi-clock-plus' }}
                </v-icon>
              </v-avatar>
            </div>
            <div class="header-text">
              <h2 class="text-h5 font-weight-bold white--text mb-1">
                {{ businessHoursController.editingBusinessHour ? 'Editar Horário' : 'Novo Horário' }}
              </h2>
              <p class="text-subtitle-1 white--text opacity-90 mb-0">
                {{ businessHoursController.editingBusinessHour ? 'Modifique o horário de funcionamento' : 'Defina o horário de funcionamento' }}
              </p>
            </div>
            <v-btn icon color="white" @click="closeBusinessHourDialog" class="ml-auto">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Form Content -->
        <v-card-text class="pa-8">
          <v-form ref="businessHourForm" v-model="businessHoursController.businessHourValid">
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="accent" class="mr-2">mdi-calendar-clock</v-icon>
                Configuração do Horário
              </h3>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="businessHoursController.businessHourForm.daysOfWeek"
                    :items="businessHoursController.dayOptions"
                    item-text="text"
                    item-value="value"
                    :label="businessHoursController.editingBusinessHour ? 'Dia da Semana' : 'Dias da Semana (selecione um ou mais)'"
                    prepend-inner-icon="mdi-calendar-multiple"
                    outlined
                    dense
                    :multiple="!businessHoursController.editingBusinessHour"
                    :chips="!businessHoursController.editingBusinessHour"
                    :rules="[v => (v && v.length > 0) || 'Selecione pelo menos um dia']"
                  >
                    <template v-slot:selection="{ item, index }" v-if="!businessHoursController.editingBusinessHour">
                      <v-chip small v-if="index < 3">
                        <span>{{ item.text }}</span>
                      </v-chip>
                      <span v-if="index === 3" class="grey--text text-caption">
                        (+{{ businessHoursController.businessHourForm.daysOfWeek.length - 3 }} outros)
                      </span>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="businessHoursController.businessHourForm.startTime"
                    label="Horário Inicial"
                    prepend-inner-icon="mdi-clock-start"
                    outlined
                    dense
                    type="time"
                    :rules="[businessHoursController.rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="businessHoursController.businessHourForm.endTime"
                    label="Horário Final"
                    prepend-inner-icon="mdi-clock-end"
                    outlined
                    dense
                    type="time"
                    :rules="[businessHoursController.rules.required]"
                  />
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-card-text>
        
        <!-- Actions -->
        <v-card-actions class="pa-8 pt-0">
          <v-btn 
            text 
            color="grey" 
            @click="closeBusinessHourDialog"
            class="px-6"
          >
            <v-icon left>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn 
            :color="businessHoursController.editingBusinessHour ? 'warning' : 'accent'" 
            :disabled="!businessHoursController.businessHourValid" 
            @click="saveBusinessHour"
            class="px-8 py-2"
            elevation="2"
          >
            <v-icon left>{{ businessHoursController.editingBusinessHour ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
            {{ businessHoursController.editingBusinessHour ? 'Salvar Alterações' : 'Criar Horário' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Exclusão Horário -->
    <v-dialog v-model="businessHoursController.deleteDialog" max-width="400px" persistent>
      <v-card style="border-radius: 16px">
        <v-card-title class="error white--text pa-6">
          <v-icon left color="white" size="28">mdi-delete-alert</v-icon>
          <div class="text-h6 font-weight-bold">Confirmar Exclusão</div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div class="text-center">
            <v-icon color="error" size="64" class="mb-4">mdi-delete-circle</v-icon>
            <div class="text-h6 mb-2">Tem certeza?</div>
            <div class="text-body-1" v-if="businessHoursController.deletingBusinessHours.length === 1">
              Deseja excluir o horário de <strong>{{ businessHoursController.getDayName(businessHoursController.deletingBusinessHours[0].dayOfWeek) }}</strong>?
            </div>
            <div class="text-body-1" v-else>
              Deseja excluir <strong>{{ businessHoursController.deletingBusinessHours.length }} horários</strong>?
            </div>
            <div class="text-caption mt-2 error--text">
              Esta ação não pode ser desfeita.
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-btn text @click="businessHoursController.closeDeleteDialog()">
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn color="error" @click="businessHoursController.confirmDelete()">
            <v-icon left>mdi-delete</v-icon>
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Edição em Lote -->
    <v-dialog v-model="businessHoursController.bulkEditDialog" max-width="600px" persistent>
      <v-card class="business-hour-dialog" elevation="24">
        <div class="dialog-header business-hour-header">
          <div class="header-content">
            <div class="header-icon">
              <v-avatar size="56" color="accent" class="elevation-4">
                <v-icon size="28" color="white">mdi-pencil-box-multiple</v-icon>
              </v-avatar>
            </div>
            <div class="header-text">
              <h2 class="text-h5 font-weight-bold white--text mb-1">
                Editar Múltiplos Horários
              </h2>
              <p class="text-subtitle-1 white--text opacity-90 mb-0">
                {{ businessHoursController.selectedBusinessHours.length }} horário(s) selecionado(s)
              </p>
            </div>
            <v-btn icon color="white" @click="businessHoursController.closeBulkEditDialog()" class="ml-auto">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        
        <v-card-text class="pa-8">
          <v-form ref="bulkEditForm" v-model="businessHoursController.bulkEditValid">
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="accent" class="mr-2">mdi-calendar-clock</v-icon>
                Novos Horários
              </h3>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="businessHoursController.bulkEditForm.startTime"
                    label="Horário Inicial"
                    prepend-inner-icon="mdi-clock-start"
                    outlined
                    dense
                    type="time"
                    :rules="[businessHoursController.rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="businessHoursController.bulkEditForm.endTime"
                    label="Horário Final"
                    prepend-inner-icon="mdi-clock-end"
                    outlined
                    dense
                    type="time"
                    :rules="[businessHoursController.rules.required]"
                  />
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-8 pt-0">
          <v-btn 
            text 
            color="grey" 
            @click="businessHoursController.closeBulkEditDialog()"
            class="px-6"
          >
            <v-icon left>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn 
            color="accent" 
            :disabled="!businessHoursController.bulkEditValid" 
            @click="saveBulkEdit"
            class="px-8 py-2 white--text"
            elevation="2"
          >
            <v-icon left>mdi-content-save</v-icon>
            Salvar Alterações
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Exclusão Serviço -->
    <v-dialog v-model="serviceController.deleteDialog" max-width="400px" persistent>
      <v-card style="border-radius: 16px">
        <v-card-title class="error white--text pa-6">
          <v-icon left color="white" size="28">mdi-delete-alert</v-icon>
          <div class="text-h6 font-weight-bold">Confirmar Exclusão</div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div class="text-center">
            <v-icon color="error" size="64" class="mb-4">mdi-delete-circle</v-icon>
            <div class="text-h6 mb-2">Tem certeza?</div>
            <div class="text-body-1">
              Deseja excluir o serviço <strong>{{ serviceController.deletingService && serviceController.deletingService.name }}</strong>?
            </div>
            <div class="text-caption mt-2 error--text">
              Esta ação não pode ser desfeita.
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-btn text @click="serviceController.closeDeleteDialog()">
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn color="error" @click="serviceController.confirmDelete()">
            <v-icon left>mdi-delete</v-icon>
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Exclusão Profissional -->
    <v-dialog v-model="professionalController.deleteDialog" max-width="400px" persistent>
      <v-card style="border-radius: 16px">
        <v-card-title class="error white--text pa-6">
          <v-icon left color="white" size="28">mdi-delete-alert</v-icon>
          <div class="text-h6 font-weight-bold">Confirmar Exclusão</div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div class="text-center">
            <v-icon color="error" size="64" class="mb-4">mdi-delete-circle</v-icon>
            <div class="text-h6 mb-2">Tem certeza?</div>
            <div class="text-body-1">
              Deseja excluir o profissional <strong>{{ professionalController.deletingProfessional && professionalController.deletingProfessional.name }}</strong>?
            </div>
            <div class="text-caption mt-2 error--text">
              Esta ação não pode ser desfeita.
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-btn text @click="professionalController.closeDeleteDialog()">
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn color="error" @click="professionalController.confirmDelete()">
            <v-icon left>mdi-delete</v-icon>
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="5000"
      top
      centered
      min-width="400px"
      max-width="600px"
      elevation="8"
      shaped
    >
      <div class="d-flex align-center">
        <v-icon color="white" class="mr-3" size="24">
          {{ snackbarColor === 'success' ? 'mdi-check-circle' : snackbarColor === 'error' ? 'mdi-alert-circle' : 'mdi-information' }}
        </v-icon>
        <span class="text-subtitle-1 font-weight-medium">{{ snackbarText }}</span>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
          small
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
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

<style scoped>
/* Dialog Styles */
.service-dialog,
.professional-dialog,
.business-hour-dialog {
  border-radius: 20px !important;
  overflow: hidden;
}

.dialog-header {
  padding: 24px;
}

.service-header {
  background: linear-gradient(135deg, #00695c 0%, #004d40 100%);
}

.professional-header {
  background: linear-gradient(135deg, #00695c 0%, #004d40 100%);
}

.business-hour-header {
  background: linear-gradient(135deg, #00897b 0%, #00695c 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  flex-shrink: 0;
}

.header-text {
  flex-grow: 1;
}

.form-section {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  background: #fafafa;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .dialog-header {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>