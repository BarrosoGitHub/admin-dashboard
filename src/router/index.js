import {createRouter, createWebHistory} from 'vue-router';
import axios from 'axios';

const routes = [
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
  // ...other routes...
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

async function isLoggedIn() {
  const token = localStorage.getItem('jwt');
  console.log('JWT from localStorage:', token); // Debug log
  if (!token) return false;
  try {
    const resp = await axios.get(`http://localhost:5087/auth/validate?token=${encodeURIComponent(token)}`);
    return resp.data && resp.data.Valid === true;
  } catch {
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
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
});

export default router;