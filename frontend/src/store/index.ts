import Vue from 'vue';
import Vuex from 'vuex';
import { User, Appointment } from '@/types';

Vue.use(Vuex);

interface State {
  user: User | null;
  appointments: Appointment[];
  isAuthenticated: boolean;
}

export default new Vuex.Store<State>({
  state: {
    user: null,
    appointments: [],
    isAuthenticated: false
  },
  mutations: {
    SET_USER(state, user: User) {
      state.user = user;
      state.isAuthenticated = true;
    },
    LOGOUT(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.appointments = [];
    },
    SET_APPOINTMENTS(state, appointments: Appointment[]) {
      state.appointments = appointments;
    },
    ADD_APPOINTMENT(state, appointment: Appointment) {
      state.appointments.push(appointment);
    }
  },
  actions: {
    login({ commit }, user: User) {
      commit('SET_USER', user);
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
    setAppointments({ commit }, appointments: Appointment[]) {
      commit('SET_APPOINTMENTS', appointments);
    },
    addAppointment({ commit }, appointment: Appointment) {
      commit('ADD_APPOINTMENT', appointment);
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    userAppointments: state => state.appointments
  }
});