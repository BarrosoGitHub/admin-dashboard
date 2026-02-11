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
    <!-- Connection Icon -->
    <div class="flex justify-center items-center mb-8">
      <img
        src="@/assets/connection.png"
        alt="Connection"
        class="h-12 w-auto"
      />
    </div>
    <div class="py-4 overflow-y-auto flex-1">
      <!-- Menus Section -->
      <div class="mb-6">
        <h3 class="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h3>
        <ul class="space-y-1">
          <!-- Profile Section -->
          <li>
            <button 
              @click="toggleProfileMenu" 
              class="w-full flex items-center px-3 py-2.5 text-sm text-gray-300 rounded-lg group transition-all duration-200 hover:bg-gray-800/50"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span class="flex-1 text-left">Profile</span>
              <svg :class="['w-4 h-4 transition-transform duration-200 text-gray-400', profileMenuOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Profile Submenu -->
            <ul :class="['mt-1 space-y-0.5 overflow-hidden transition-all duration-300', profileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0']">
              <li>
                <a href="#" class="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-gray-300 ml-11 transition-all duration-200" @click.prevent="scrollToSection('summary')">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>
                  Summary
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-gray-300 ml-11 transition-all duration-200" @click.prevent="scrollToSection('skills')">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>
                  Technical Skills
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-gray-300 ml-11 transition-all duration-200" @click.prevent="scrollToSection('experience')">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>
                  Work Experience
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-gray-300 ml-11 transition-all duration-200" @click.prevent="scrollToSection('education')">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>
                  Education
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-gray-300 ml-11 transition-all duration-200" @click.prevent="scrollToSection('certifications')">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>
                  Certifications
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-gray-300 ml-11 transition-all duration-200" @click.prevent="scrollToSection('languages')">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>
                  Languages
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- Apps Section -->
      <div>
        <h3 class="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Apps</h3>
        <ul class="space-y-1">
          <!-- Portfolio Section -->
          <li>
            <button
              @click="togglePortfolioMenu"
              :class="[
                'w-full flex items-center px-3 py-2.5 text-sm rounded-lg group transition-all duration-200',
                portfolioMenuOpen ? 'bg-gray-700/30 text-gray-200' : 'text-gray-300 hover:bg-gray-800/50'
              ]"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span class="flex-1 text-left">Portfolio</span>
              <svg :class="['w-4 h-4 transition-transform duration-200', portfolioMenuOpen ? 'rotate-180 text-gray-300' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Portfolio Submenu -->
            <ul :class="['mt-1 space-y-0.5 overflow-hidden transition-all duration-300', portfolioMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0']">
              <li>
                <a href="#" class="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-gray-300 ml-11 transition-all duration-200" @click.prevent="openProject(1)">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>
                  Ad Display Device
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-gray-300 ml-11 transition-all duration-200" @click.prevent="openProject(5)">
                  <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>
                  Necro Brawl Showcase
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
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
  'portfolio',
  'project-selected',
  'profile'
]);

const showSidebar = ref(props.show);
const boardType = ref('');
const profileMenuOpen = ref(false);
const portfolioMenuOpen = ref(false);

watch(
  () => props.show,
  (val) => {
    showSidebar.value = val;
  }
);

watch(showSidebar, (val) => {
  emit('sidebar-toggle', val);
});

function togglePortfolioMenu() {
  portfolioMenuOpen.value = !portfolioMenuOpen.value;
  profileMenuOpen.value = false;
  if (portfolioMenuOpen.value) {
    emit('portfolio');
  }
}

function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value;
  portfolioMenuOpen.value = false;
  if (profileMenuOpen.value) {
    emit('profile');
  }
}

function scrollToSection(sectionId) {
  emit('profile');
  // Give the profile view time to render, then scroll
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

function openProject(projectId) {
  emit('project-selected', projectId);
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
</style>