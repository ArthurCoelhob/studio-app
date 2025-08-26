<template>
  <v-container fluid fill-height class="login-container">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-8 pa-6">
          <v-card-title class="justify-center mb-6">
            <h1 class="text-h4 primary--text font-weight-bold">Studio App</h1>
          </v-card-title>
          
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="cpf"
              label="CPF"
              outlined
              large
              prepend-inner-icon="mdi-account"
              :rules="[rules.required]"
              class="mb-4"
            />
            
            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              outlined
              large
              prepend-inner-icon="mdi-lock"
              :rules="[rules.required]"
              class="mb-6"
            />
            
            <v-btn
              type="submit"
              color="primary"
              large
              block
              :loading="loading"
              class="text-h6 py-6"
            >
              Entrar
            </v-btn>
          </v-form>
          
          <v-divider class="my-6" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { MockService } from '@/services/mockService'

@Component
export default class Login extends Vue {
  cpf = ''
  password = ''
  loading = false
  
  rules = {
    required: (value: string) => !!value || 'Campo obrigatório'
  }

  async handleLogin() {
    if (!this.cpf || !this.password) return
    
    this.loading = true
    
    try {
      const user = await MockService.login(this.cpf, this.password)
      
      if (user) {
        this.$store.dispatch('login', user)
        this.$router.push('/home')
      } else {
        alert('CPF não encontrado')
      }
    } catch (error) {
      console.error('Erro no login:', error)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
  min-height: 100vh;
}
</style>