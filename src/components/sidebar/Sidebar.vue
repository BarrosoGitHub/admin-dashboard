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
        <!-- Profile Section -->
        <li>
          <a href="#" class="flex items-center p-2 text-color rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group" @click.prevent="toggleProfileMenu">
            <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-color dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
            <span class="ms-3 flex-1">Profile</span>
            <svg :class="['w-4 h-4 transition-transform duration-200', profileMenuOpen ? 'rotate-180' : '']" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </a>
          <!-- Profile Submenu -->
          <ul :class="['ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-300', profileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0']">
            <li>
              <a href="#" class="flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-color" @click.prevent="scrollToSection('summary')">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Summary
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-color" @click.prevent="scrollToSection('skills')">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Technical Skills
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-color" @click.prevent="scrollToSection('experience')">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Work Experience
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-color" @click.prevent="scrollToSection('education')">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Education
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-color" @click.prevent="scrollToSection('certifications')">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Certifications
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-color" @click.prevent="scrollToSection('languages')">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Languages
              </a>
            </li>
          </ul>
        </li>
        <!-- Portfolio Section -->
        <li>
          <button
            @click="togglePortfolioMenu"
            class="w-full flex items-center p-2 text-color rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-color dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
            </svg>
            <span class="ms-3">Portfolio</span>
            <svg :class="['w-4 h-4 ml-auto transition-transform duration-200', portfolioMenuOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Portfolio Submenu -->
          <ul :class="['mt-2 space-y-1 overflow-hidden transition-all duration-300', portfolioMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0']">
            <li>
              <a href="#" class="flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-color ml-6" @click.prevent="scrollToProject('project-1')">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Ad Display Device
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-color ml-6" @click.prevent="scrollToProject('project-5')">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Necro Brawl Showcase
              </a>
            </li>
          </ul>
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

function scrollToProject(projectId) {
  emit('portfolio');
  // Give the portfolio view time to render, then scroll
  setTimeout(() => {
    const element = document.getElementById(projectId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
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