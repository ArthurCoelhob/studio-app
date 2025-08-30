import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('@/views/Schedule/Schedule.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/agenda',
    redirect: '/schedule'
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('@/views/Clients/Clients.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = store.getters.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/home');
  } else {
    next();
  }
});

export default router;