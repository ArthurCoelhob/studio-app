<template>
  <sidebar-layout>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 primary--text mb-2">Clientes</h1>
        <p class="text-subtitle-1 secondary--text">Gerencie os clientes do sistema</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card style="border-radius: 16px">
          <v-card-title class="primary white--text pa-6">
            <v-icon left color="white" size="28">mdi-account-group</v-icon>
            <div class="text-h5 font-weight-bold">Lista de Clientes</div>
            <v-spacer></v-spacer>
            <v-btn color="white" class="primary--text" @click="openClientDialog">
              <v-icon left>mdi-plus</v-icon>
              Novo Cliente
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar clientes..."
              single-line
              hide-details
              outlined
              dense
              class="mb-4"
            ></v-text-field>

            <v-data-table
              :headers="headers"
              :items="clients"
              :search="search"
              :loading="loading"
              class="elevation-1"
              :items-per-page="10"
              :footer-props="{
                'items-per-page-text': 'Itens por página:',
                'items-per-page-options': [5, 10, 25, 50]
              }"
            >
              <template v-slot:item.cpf="{ item }">
                {{ formatCpf(item.cpf) }}
              </template>

              <template v-slot:item.phone="{ item }">
                {{ formatPhone(item.phone) }}
              </template>

              <template v-slot:item.attendance="{ item }">
                <v-chip :color="item.attendance > 0 ? 'success' : 'grey'" small>
                  {{ item.attendance || 0 }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="editClient(item)"
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="deleteClient(item)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Excluir</span>
                </v-tooltip>
              </template>

              <template v-slot:no-data>
                <div class="text-center pa-4">
                  <v-icon size="64" color="grey">mdi-account-off</v-icon>
                  <div class="text-h6 grey--text mt-2">Nenhum cliente encontrado</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog Cliente -->
    <v-dialog v-model="clientDialog" max-width="900px" persistent>
      <v-card class="client-dialog" elevation="24">
        <!-- Header Gradient -->
        <div class="dialog-header client-header">
          <div class="header-content">
            <div class="header-icon">
              <v-avatar size="56" :color="editingClient ? 'warning' : 'primary'" class="elevation-4">
                <v-icon size="28" color="white">
                  {{ editingClient ? 'mdi-pencil' : 'mdi-account-plus' }}
                </v-icon>
              </v-avatar>
            </div>
            <div class="header-text">
              <h2 class="text-h5 font-weight-bold white--text mb-1">{{ formTitle }}</h2>
              <p class="text-subtitle-1 white--text opacity-90 mb-0">
                {{ editingClient ? 'Modifique os dados do cliente' : 'Preencha os dados para o novo cliente' }}
              </p>
            </div>
            <v-btn icon color="white" @click="closeClientDialog" class="ml-auto">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Form Content -->
        <v-card-text class="pa-8">
          <v-form ref="clientForm" v-model="clientValid">
            <!-- Dados Pessoais Section -->
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="primary" class="mr-2">mdi-account-circle</v-icon>
                Dados Pessoais
              </h3>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="clientForm.name"
                    label="Nome Completo"
                    prepend-inner-icon="mdi-account"
                    outlined
                    dense
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="clientForm.cpf"
                    label="CPF"
                    prepend-inner-icon="mdi-card-account-details"
                    outlined
                    dense
                    :rules="[rules.required, rules.cpf]"
                    v-mask="'###.###.###-##'"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Contato Section -->
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="primary" class="mr-2">mdi-contacts</v-icon>
                Informações de Contato
              </h3>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="clientForm.email"
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    outlined
                    dense
                    :rules="[rules.required, rules.email]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="clientForm.phone"
                    label="Telefone"
                    prepend-inner-icon="mdi-phone"
                    outlined
                    dense
                    :rules="[rules.required]"
                    v-mask="'(##) #####-####'"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="clientForm.address"
                    label="Endereço"
                    prepend-inner-icon="mdi-map-marker"
                    outlined
                    dense
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Configurações Section -->
            <div class="form-section mb-6">
              <h3 class="section-title">
                <v-icon color="primary" class="mr-2">mdi-cog</v-icon>
                Configurações
              </h3>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="clientForm.serviceTypeId"
                    :items="serviceTypes"
                    item-text="name"
                    item-value="id"
                    label="Tipo de Serviço"
                    prepend-inner-icon="mdi-medical-bag"
                    outlined
                    dense
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="clientForm.password"
                    :label="editingClient ? 'Nova Senha (opcional)' : 'Senha'"
                    prepend-inner-icon="mdi-lock"
                    outlined
                    dense
                    type="password"
                    :rules="editingClient ? [] : [rules.required]"
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
            @click="closeClientDialog"
            class="px-6"
          >
            <v-icon left>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn 
            :color="editingClient ? 'warning' : 'primary'" 
            :disabled="!clientValid" 
            @click="saveClient"
            class="px-8 py-2"
            elevation="2"
          >
            <v-icon left>{{ editingClient ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
            {{ editingClient ? 'Salvar Alterações' : 'Criar Cliente' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="400px" persistent>
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
              Deseja excluir o cliente <strong>{{ deletingClient && deletingClient.name }}</strong>?
            </div>
            <div class="text-caption mt-2 error--text">
              Esta ação não pode ser desfeita.
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-btn text @click="closeDeleteDialog">
            Cancelar
          </v-btn>
          <v-spacer />
          <v-btn color="error" @click="confirmDelete">
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
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </sidebar-layout>
</template>

<script lang="ts">
import ClientsController from './ClientsController'
import SidebarLayout from '@/components/sidebarLayout.vue'

export default ClientsController.extend({
  components: {
    SidebarLayout
  },
  data() {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success'
    }
  },
  methods: {
    showNotification(text: string, color: string = 'success') {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    }
  },
  mounted() {
    this.$on('show-notification', this.showNotification);
  }
})
</script>
<style scoped>
/* Dialog Styles */
.client-dialog {
  border-radius: 20px !important;
  overflow: hidden;
}

.dialog-header {
  padding: 24px;
}

.client-header {
  background: linear-gradient(135deg, #00695c 0%, #004d40 100%);
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