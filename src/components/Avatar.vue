<template>
  <div
    ref="avatarContainerRef"
    class="relative"
    @mouseenter="showDropdown = true"
    @mouseleave="showDropdown = false"
  >
    <div
      ref="avatarRef"
      class="relative w-12 h-12 overflow-hidden border border-color bg-modal-color rounded-full cursor-pointer transition-transform duration-200 hover:scale-105"
    >
      <svg
        class="absolute w-13.5 h-14 text-gray-400 -left-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </div>
    <!-- Spacing bridge between avatar and dropdown to prevent gaps -->
    <div 
      v-if="showDropdown" 
      class="absolute right-0 top-12 h-6 w-48"
    ></div>
    <!-- Dropdown menu -->
    <Transition name="dropdown-fade">
      <div
          v-if="showDropdown"
          ref="dropdownRef"
          id="userDropdown"
          class="z-170 absolute right-0 top-16 bg-modal-color divide-y divide-neutral-700 rounded-lg shadow-sm w-64 border border-color shadow-xl"
        >
    <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
      <div>Username [PH]</div>
    </div>
    <ul
      class="py-2 text-sm text-gray-700 dark:text-gray-200"
      aria-labelledby="avatarButton"
    >
      <li>
        <a
          href="#"
          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >Settings</a
        >
      </li>

    </ul>
    <div class="py-2 px-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-700 dark:text-gray-200">Theme</span>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="isDarkMode" @change="toggleTheme">
            <div
              :class="[
                'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:rounded-full after:h-5 after:w-5 after:border transition-all duration-200',
                isDarkMode ? 'theme-toggle-dark theme-ball-light' : 'theme-toggle-light theme-ball-dark'
              ]"
              style="border: 0px solid var(--toggle-border);"
            ></div>
          </label>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="py-2 px-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-700 dark:text-gray-200">Tech Mode</span>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
          </svg>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="isTechMode" @change="toggleTechMode">
            <div
              :class="[
                'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:rounded-full after:h-5 after:w-5 after:border transition-all duration-200',
                isTechMode ? 'tech-toggle-on tech-ball-on' : 'tech-toggle-off tech-ball-off'
              ]"
              style="border: 0px solid var(--toggle-border);"
            ></div>
          </label>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
    </div>
      </div>
    </Transition>
    <TechModeConfirmationModal ref="techModeConfirmationModal" />
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { API_BASE_URL } from "../apiConfig";
import TechModeConfirmationModal from "./Modals/TechModeConfirmationModal.vue";

const showDropdown = ref(false);
const isDarkMode = ref(true); // Default to dark mode since the app appears to be dark themed
const isTechMode = ref(false); // OPT Tech Mode toggle
const dropdownRef = ref(null);
const avatarRef = ref(null);
const avatarContainerRef = ref(null);
const techModeConfirmationModal = ref(null);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function toggleTheme() {
  // Toggle the dark class on the HTML element for Tailwind CSS dark mode
  const htmlElement = document.documentElement;
  
  if (isDarkMode.value) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
  
  // Store the preference in localStorage
  localStorage.setItem('darkMode', isDarkMode.value.toString());
  
  console.log('Theme toggled to:', isDarkMode.value ? 'Dark' : 'Light');
}

async function toggleTechMode() {
  const targetState = isTechMode.value;
  
  try {
    // Show confirmation modal
    await techModeConfirmationModal.value.open(targetState);
    
    // User confirmed, proceed with API call
    const response = await fetch(`${API_BASE_URL}/opt-configuration/toggle-tech-mode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const success = await response.json();
      console.log('Tech mode toggled:', isTechMode.value ? 'Enabled' : 'Disabled');
      
      // Start monitoring system reboot
      techModeConfirmationModal.value.startRebootMonitoring();
    } else {
      // Revert the toggle if the API call failed
      isTechMode.value = !isTechMode.value;
      techModeConfirmationModal.value.setError();
      console.error('Failed to toggle tech mode');
    }
  } catch (error) {
    // User cancelled or there was an error - revert the toggle
    isTechMode.value = !isTechMode.value;
    if (error !== false) {
      // Only log if it's an actual error, not a user cancellation
      console.error('Error toggling tech mode:', error);
    }
  }
}

async function fetchTechModeState() {
  try {
    const response = await fetch(`${API_BASE_URL}/opt-configuration/is-tech-mode-enabled`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      isTechMode.value = await response.json();
      console.log('Tech mode state:', isTechMode.value ? 'Enabled' : 'Disabled');
    }
  } catch (error) {
    console.error('Error fetching tech mode state:', error);
  }
}

onMounted(() => {
  // Initialize dark mode from localStorage or default to true
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === 'true';
  } else {
    // Default to dark mode
    isDarkMode.value = true;
    localStorage.setItem('darkMode', 'true');
  }
  
  // Apply the initial theme
  const htmlElement = document.documentElement;
  if (isDarkMode.value) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }

  // Fetch tech mode state from API
  fetchTechModeState();
});

onUnmounted(() => {
  // No cleanup needed
});

defineExpose({ toggleDropdown });
</script>

<style scoped>
.theme-toggle-dark {
  background-color: #6b7280; /* Gray-500 - greyer for dark mode */
  transition: background-color 0.3s ease;
}

.theme-toggle-light {
  background-color: #f3f4f6; /* Gray-100 - whiter for light mode */
  transition: background-color 0.3s ease;
}

.theme-ball-dark::after {
  background-color: #5c5c5c; /* Dark gray ball for dark mode */
  border-color: #747474; /* Darker border for dark mode */
  transition: all 0.3s ease;
}

.theme-ball-light::after {
  background-color: #ffffff; /* White ball for light mode */
  border-color: #d1d5db; /* Light gray border for light mode */
  transition: all 0.3s ease;
}

/* Dropdown transition animations */
.dropdown-fade-enter-active {
  animation: dropdown-fade-in 0.2s ease-out;
}

.dropdown-fade-leave-active {
  animation: dropdown-fade-out 0.15s ease-in;
}

@keyframes dropdown-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdown-fade-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}

.tech-toggle-on {
  background-color: #6b7280; /* Gray-500 - matching dark mode toggle */
  transition: background-color 0.3s ease;
}

.tech-toggle-off {
  background-color: #f3f4f6; /* Gray-100 - matching light mode toggle */
  transition: background-color 0.3s ease;
}

.tech-ball-on::after {
  background-color: #ffffff; /* White ball when enabled */
  border-color: #d1d5db;
  transition: all 0.3s ease;
}

.tech-ball-off::after {
  background-color: #5c5c5c; /* Dark gray ball when disabled */
  border-color: #747474;
  transition: all 0.3s ease;
}
</style>
