<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="primary"
      dark
      width="280"
      class="elevation-8"
      mobile-breakpoint="960"
    >
      <div class="pa-6 text-center" style="background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)">
        <v-avatar size="72" class="mb-4" style="border: 3px solid rgba(255,255,255,0.3)">
          <v-icon size="48" color="white">mdi-account-circle</v-icon>
        </v-avatar>
        <div class="white--text">
          <div class="text-h6 font-weight-bold mb-1">{{ currentUser && currentUser.name }}</div>
          <v-chip small color="rgba(255,255,255,0.2)" text-color="white" class="font-weight-medium">
            {{ userRole }}
          </v-chip>
        </div>
      </div>

      <v-divider class="mx-4 my-4" style="border-color: rgba(255,255,255,0.2)" />

      <v-list nav dense class="transparent">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.route"
          link
          class="mb-2 mx-3"
          style="border-radius: 12px; transition: all 0.3s ease"
          active-class="white"
        >
          <v-list-item-icon>
            <v-icon :color="$route.path === item.route ? 'primary' : 'white'" size="24">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title 
              :class="$route.path === item.route ? 'primary--text font-weight-bold' : 'white--text font-weight-medium'"
              class="text-subtitle-1"
            >
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-spacer />

      <div class="pa-4">
        <v-btn
          @click="logout"
          block
          outlined
          color="white"
          class="text-subtitle-1"
          style="border-radius: 8px; border-width: 2px"
        >
          <v-icon left>mdi-logout</v-icon>
          Sair
        </v-btn>
      </div>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="primary" dark elevation="4" height="64">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="text-h5 font-weight-bold ml-2">Studio App</v-toolbar-title>
      <v-spacer />
      <v-chip color="accent" dark class="mr-4">
        <v-icon left small>mdi-calendar-today</v-icon>
        {{ currentDate }}
      </v-chip>
      <v-btn icon>
        <v-badge color="error" content="3" overlap>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>

    <v-main style="background: linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 100%); min-height: 100vh">
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SidebarLayout extends Vue {
  drawer = true

  get currentUser() {
    return this.$store.getters.currentUser;
  }

  get userRole() {
    return this.currentUser && this.currentUser.role === 'admin' ? 'Administrador' : 'Cliente';
  }

  get currentDate() {
    return new Date().toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  }

  get menuItems() {
    const baseItems = [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/home' },
      { title: 'Agenda', icon: 'mdi-calendar-month', route: '/schedule' }
    ];

    if (this.currentUser && this.currentUser.role === 'admin') {
      baseItems.push(
        { title: 'Clientes', icon: 'mdi-account-group', route: '/clients' },
        { title: 'Configurações', icon: 'mdi-cog', route: '/settings' }
      );
    }

    return baseItems;
  }

  logout() {
    this.$store.dispatch('logout');
    this.$router.push('/login');
  }
}
</script>