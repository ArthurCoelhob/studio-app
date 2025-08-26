import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#F5F5F5',
        accent: '#2196F3',
        success: '#4CAF50',
        error: '#FF5252',
        warning: '#FF9800',
        info: '#2196F3',
        background: '#FFFFFF',
        surface: '#FFFFFF'
      }
    }
  },
  icons: {
    iconfont: 'mdi'
  }
} as any)