<template>
  <v-container fluid fill-height class="login-container">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-8 pa-6">
          <v-card-title class="justify-center mb-6">
            <h1 class="text-h4 primary--text font-weight-bold">Studio App</h1>
          </v-card-title>
          
          <v-form ref="form" v-model="valid" @submit.prevent="login">
            <v-text-field
              v-model="form.cpf"
              label="CPF"
              outlined
              large
              prepend-inner-icon="mdi-account"
              class="mb-4"
            />
            
            <v-text-field
              v-model="form.password"
              label="Senha"
              type="password"
              outlined
              large
              prepend-inner-icon="mdi-lock"
              class="mb-4"
            />
            
            <v-alert v-if="errorMessage" type="error" class="mb-4">
              {{ errorMessage }}
            </v-alert>
            
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
import LoginController from './LoginController'

export default LoginController
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #00695c 0%, #00897b 100%);
  min-height: 100vh;
}
</style>