<template>

<div>
  <!-- Sidebar -->
  <aside
    :class=" [
      'fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto bg-sidebar-color-gradient transition-transform duration-300 ease-in-out',
      showSidebar ? 'translate-x-0 sidebar-shadow' : '-translate-x-full'
    ]"
    aria-label="Sidebar"
    style="display: flex; flex-direction: column; height: 100vh;"
  >
    <!-- Top accent bar -->
    <div class="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent flex-shrink-0"></div>

    <!-- Logo / Brand -->
    <div class="flex justify-center items-center px-4 pt-6 pb-5 flex-shrink-0">
      <img
        src="@/assets/connection.png"
        alt="Connection"
        class="h-10 w-auto opacity-90"
      />
    </div>

    <!-- Divider -->
    <div class="mx-4 mb-4 h-px bg-white/5 flex-shrink-0"></div>

    <div class="px-3 pb-4 overflow-y-auto flex-1 space-y-6">
      <!-- Main Section -->
      <div>
        <p class="px-2 mb-2 text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest">Main</p>
        <ul class="space-y-0.5">
          <!-- Profile -->
          <li>
            <button 
              @click="toggleProfileMenu" 
              :class="[
                'w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group',
                profileMenuOpen
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
              ]"
            >
              <svg :class="['w-4 h-4 mr-3 flex-shrink-0 transition-colors', profileMenuOpen ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="flex-1 text-left font-medium">Profile</span>
              <svg :class="['w-3.5 h-3.5 transition-transform duration-200', profileMenuOpen ? 'rotate-180 text-indigo-400' : 'text-gray-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Profile Submenu -->
            <ul :class="['mt-1 space-y-0.5 overflow-hidden transition-all duration-300 pl-3', profileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0']">
              <li v-for="item in [
                { id: 'summary',        label: 'Summary' },
                { id: 'skills',         label: 'Technical Skills' },
                { id: 'experience',     label: 'Work Experience' },
                { id: 'education',      label: 'Education' },
                { id: 'languages',      label: 'Languages' }
              ]" :key="item.id">
                <a href="#"
                  class="flex items-center px-3 py-2 text-xs text-gray-500 rounded-md hover:bg-indigo-500/10 hover:text-indigo-300 transition-all duration-150 group"
                  @click.prevent="scrollToSection(item.id)">
                  <span class="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-400 mr-2.5 flex-shrink-0 transition-colors"></span>
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- Apps Section -->
      <div>
        <p class="px-2 mb-2 text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest">Projects</p>
        <ul class="space-y-0.5">
          <li>
            <button
              @click="togglePortfolioMenu"
              :class="[
                'w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group',
                portfolioMenuOpen
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
              ]"
            >
              <svg :class="['w-4 h-4 mr-3 flex-shrink-0 transition-colors', portfolioMenuOpen ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span class="flex-1 text-left font-medium">Portfolio</span>
              <svg :class="['w-3.5 h-3.5 transition-transform duration-200', portfolioMenuOpen ? 'rotate-180 text-indigo-400' : 'text-gray-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Portfolio Submenu -->
            <ul :class="['mt-1 space-y-0.5 overflow-hidden transition-all duration-300 pl-3', portfolioMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0']">
              <li>
                <a href="#"
                  class="flex items-center px-3 py-2 text-xs text-gray-500 rounded-md hover:bg-indigo-500/10 hover:text-indigo-300 transition-all duration-150 group"
                  @click.prevent="openProject(1)">
                  <span class="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-400 mr-2.5 flex-shrink-0 transition-colors"></span>
                  Ad Display Device
                </a>
              </li>
              <li>
                <a href="#"
                  class="flex items-center px-3 py-2 text-xs text-gray-500 rounded-md hover:bg-indigo-500/10 hover:text-indigo-300 transition-all duration-150 group"
                  @click.prevent="openProject(2)">
                  <span class="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-400 mr-2.5 flex-shrink-0 transition-colors"></span>
                  Sentinel
                </a>
              </li>
              <li>
                <a href="#"
                  class="flex items-center px-3 py-2 text-xs text-gray-500 rounded-md hover:bg-indigo-500/10 hover:text-indigo-300 transition-all duration-150 group"
                  @click.prevent="openProject(5)">
                  <span class="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-400 mr-2.5 flex-shrink-0 transition-colors"></span>
                  Necro Brawl Showcase
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
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