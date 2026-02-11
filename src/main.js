import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'

// Initialize dark mode from localStorage
const savedDarkMode = localStorage.getItem('darkMode');
const isDarkMode = savedDarkMode !== null ? savedDarkMode === 'true' : true; // Default to dark mode

// Apply the initial theme to the HTML element
const htmlElement = document.documentElement;
if (isDarkMode) {
  htmlElement.classList.add('dark');
} else {
  htmlElement.classList.remove('dark');
}

const app = createApp(App)
app.use(router)
app.use(VueApexCharts)
app.mount('#app')
