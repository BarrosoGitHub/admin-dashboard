import {createRouter, createWebHistory} from 'vue-router';
import axios from 'axios';
import { API_BASE_URL } from '@/apiConfig.js';

const routes = [
  {
    path: '/',
    redirect: { name: 'Home' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

async function isLoggedIn() {
  const token = localStorage.getItem('jwt');
  if (!token) return false;
  try {
    const resp = await axios.get(`${API_BASE_URL}/auth/validate?token=${encodeURIComponent(token)}`, {
      timeout: 5000 // 5 second timeout
    });
    return resp.data && resp.data.Valid === true;
  } catch (error) {
    console.warn('Authentication validation failed:', error.message);
    // Clear invalid token if the request failed
    localStorage.removeItem('jwt');
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  try {
    if (to.meta.requiresAuth) {
      if (await isLoggedIn()) {
        next();
      } else {
        next({ name: 'Login' });
      }
    } else if (to.meta.guest) {
      if (await isLoggedIn()) {
        next({ name: 'Home' });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.error('Router navigation error:', error);
    // If there's an error in the navigation guard, redirect to login
    next({ name: 'Login' });
  }
});

export default router;