<template>

<div class="bg-white rounded ">
  <!-- Sidebar -->
  <aside
    :class=" [
      'fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto bg-sidebar-color-gradient transition-transform duration-300 ease-in-out',
      showSidebar ? 'translate-x-0 sidebar-shadow' : '-translate-x-full'
    ]"
    aria-label="Sidebar"
    style="display: flex; flex-direction: column; height: 100vh;"
  >
    <!-- Petrotec Icon -->
    <div class="flex justify-center items-center mb-8">
      <img
        src="@/assets/Petrotec-icon.png"
        alt="Petrotec Icon"
        class="h-12 w-auto"
        style="fill: #EEEEEE;"
      />
    </div>
    <!-- Add a horizontal line below the icon -->
    <hr class="border-gray-600 mb-2 border-color" />
    <div class="flex justify-between items-center " >
    </div>
    <div class="py-4 overflow-y-auto flex-1">
      <ul class="space-y-2 font-medium">
        <li>
          <a href="#" class="flex items-center p-2 text-color rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group" @click.prevent="handleDashboardClick">
            <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-color dark:group-hover:text-white" fill="currentColor" viewBox="0 0 22 21">
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
            </svg>
            <span class="ms-3">Dashboard</span>
          </a>
        </li>
        <!-- Portfolio Section -->
        <li>
          <a href="#" class="flex items-center p-2 text-color rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group" @click.prevent="handlePortfolioClick">
            <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-color dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
            </svg>
            <span class="ms-3">Portfolio</span>
          </a>
        </li>
      </ul>
    </div>
    <!-- Footer note for board type -->
    <div class="text-xs text-gray-500 text-center select-none mt-4" style="margin-top: auto;">
      Board type: <span class="font-semibold">{{ boardType }}</span>
    </div>
  </aside>
</div>

</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/apiConfig.js';

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits([
  'sidebar-toggle',
  'dashboard',
  'portfolio'
]);

const showSidebar = ref(props.show);
const boardType = ref('');

watch(
  () => props.show,
  (val) => {
    showSidebar.value = val;
  }
);

watch(showSidebar, (val) => {
  emit('sidebar-toggle', val);
});

function handleDashboardClick() {
  axios.get(`${API_BASE_URL}/info/services`)
    .then(response => {
      emit('dashboard', response.data);
    })
    .catch(error => {
      emit('dashboard', []);
    });
}

function handlePortfolioClick() {
  emit('portfolio');
}

onMounted(() => {

  window.addEventListener('sidebar-close', () => {
    showSidebar.value = false;
  });
  // Fetch board type for footer
  axios.get(`${API_BASE_URL}/info/services/boardtype`).then(res => {
    boardType.value = res.data?.boardType || res.data || 'Unknown';
  }).catch(() => {
    boardType.value = 'Unknown';
  });
});
onBeforeUnmount(() => {
  window.removeEventListener('sidebar-close', () => {
    showSidebar.value = false;
  });
});
</script>

<style scoped>
#dropdown-config {
  transition-property: max-height, opacity;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 0;
  opacity: 0;
  pointer-events: none;
}
#dropdown-config.max-h-40 {
  max-height: 10rem; /* adjust as needed for content */
  opacity: 1;
  pointer-events: auto;
}
html:not(.dark) img[alt="Petrotec Icon"] {
  filter: brightness(0) saturate(100%) invert(98%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(90%);
}
html.dark img[alt="Petrotec Icon"] {
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(100%) contrast(100%);
}
</style>