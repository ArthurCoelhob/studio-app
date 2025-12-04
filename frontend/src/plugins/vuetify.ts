import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#00695c',
        secondary: '#78909c',
        accent: '#00897b',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#00acc1',
        background: '#FFFFFF',
        surface: '#FFFFFF'
      }
    }
  },
  icons: {
    iconfont: 'mdi'
  }
} as any)