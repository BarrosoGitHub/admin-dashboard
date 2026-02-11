<script setup>
  import Avatar from '../Avatar.vue';
  import SearchBar from '../searchbar/SearchBar.vue';
  import { ref, onMounted } from 'vue';
  
  const props = defineProps({
    searchValue: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    activeCard: {
      type: String,
      default: ''
    },
    sidebarOpen: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['sidebar-toggle', 'search-update', 'navigate-to-profile', 'navigate-to-portfolio']);
  
  const isHovered = ref(false);
  const isDarkMode = ref(true);
  
  function navigateToProfile() {
    emit('navigate-to-profile');
  }
  
  function navigateToPortfolio() {
    emit('navigate-to-portfolio');
  }
  
  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value;
    
    const htmlElement = document.documentElement;
    if (isDarkMode.value) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', isDarkMode.value.toString());
  }
  
  onMounted(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      isDarkMode.value = savedDarkMode === 'true';
    } else {
      isDarkMode.value = true;
      localStorage.setItem('darkMode', 'true');
    }
    
    const htmlElement = document.documentElement;
    if (isDarkMode.value) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  });
  
  function handleSearchUpdate(value) {
    emit('search-update', value);
  }

  function handleSidebarToggle() {
    isHovered.value = false; // Reset hover state after click
    emit('sidebar-toggle');
  }
</script>

<template>
  
  <div class="fixed top-0 left-0 right-0 z-50 navbar-blur bg-gradient-to-b from-black/30 via-black/20 to-transparent dark:from-black/50 dark:via-black/30 dark:to-transparent border-b border-gray-200/10 dark:border-gray-700/20">

    <nav class="max-w-full">
            

      <div class="flex items-center justify-start py-5 px-8">
        <button
          type="button"
          @click="handleSidebarToggle"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          class="inline-flex items-center justify-center p-0.5 w-12 h-12 text-sm icon-color rounded-full bg-modal-color transition-all duration-200 hover:scale-105 relative overflow-hidden"
          aria-controls="navbar-hamburger"
          aria-expanded="false"
          style="z-index: 40; position: relative;"
        >
          <span class="sr-only">Open Sidebar</span>
          <!-- Hamburger Icon -->
          <svg
            class="w-5 h-5 absolute transition-all duration-300"
            :class="isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
          <!-- Arrow Icon (Right when closed, Left when open) -->
          <svg
            v-if="!sidebarOpen"
            class="w-5 h-5 absolute transition-all duration-300"
            :class="isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          <svg
            v-else
            class="w-5 h-5 absolute transition-all duration-300"
            :class="isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        <div class="pl-10 text-2xl font-semibold text-color">
          {{ activeCard }}
        </div>
        
        <!-- Navigation Buttons -->
        <div class="flex items-center gap-3 ml-8">
          <button
            @click="navigateToProfile"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border"
            :class="isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50 hover:text-white' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900'"
          >
            <svg class="w-4 h-4 inline-block mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </button>
          <button
            @click="navigateToPortfolio"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border"
            :class="isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50 hover:text-white' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900'"
          >
            <svg class="w-4 h-4 inline-block mr-2 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Projects
          </button>
        </div>
        
        <div class="flex-1"></div>
        <div class="flex justify-end items-center gap-6">
          <div v-if="showSearch">
            <SearchBar
              :modelValue="searchValue"
              @update:modelValue="handleSearchUpdate"
              :label="`Search ${activeCard}`"
              :placeholder="`Search in ${activeCard}...`"
            />
          </div>
          
          <!-- Modern Theme Toggle -->
          <button
            @click="toggleTheme"
            class="relative p-2.5 rounded-lg border transition-all duration-300 group"
            :class="isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-500/50' 
              : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'"
            :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <!-- Sun Icon (Light Mode) -->
            <svg
              v-if="!isDarkMode"
              class="w-5 h-5 text-gray-600 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <!-- Moon Icon (Dark Mode) -->
            <svg
              v-else
              class="w-5 h-5 text-gray-400 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
          
          <Avatar />
        </div>
      </div>

    </nav>
  </div>
</template>
<style scoped>
.navbar-blur {
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  animation: progressive-blur 0.8s ease-out forwards;
}

@keyframes progressive-blur {
  0% {
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
  }
  100% {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
}

/* Continuously progressive blur on scroll */
.navbar-blur::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.1) 0%, 
    rgba(0, 0, 0, 0.05) 50%, 
    transparent 100%
  );
  pointer-events: none;
}

:global(.dark) .navbar-blur::before {
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.2) 0%, 
    rgba(0, 0, 0, 0.1) 50%, 
    transparent 100%
  );
}
</style>