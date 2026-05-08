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
  
  <div class="fixed top-0 left-0 right-0 z-50 navbar-bar">

    <nav class="max-w-full">
      <div class="flex items-center py-3.5 px-6 gap-4">

        <!-- Sidebar toggle -->
        <button
          type="button"
          @click="handleSidebarToggle"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm icon-color bg-modal-color-gradient border border-color transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-300 hover:shadow-[0_0_12px_rgba(99,102,241,0.2)] relative overflow-hidden flex-shrink-0"
          aria-controls="navbar-hamburger"
          aria-expanded="false"
        >
          <span class="sr-only">Toggle Sidebar</span>
          <svg class="w-4 h-4 absolute transition-all duration-300"
            :class="isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'"
            fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
          <svg v-if="!sidebarOpen" class="w-4 h-4 absolute transition-all duration-300"
            :class="isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
          </svg>
          <svg v-else class="w-4 h-4 absolute transition-all duration-300"
            :class="isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Divider -->
        <div class="h-5 w-px bg-white/10 flex-shrink-0"></div>

        <!-- Page title -->
        <span class="text-sm font-semibold text-color tracking-wide select-none">{{ activeCard }}</span>

        <!-- Nav pills -->
        <div class="flex items-center gap-2 ml-2">
          <button @click="navigateToProfile"
            class="nav-pill flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Profile
          </button>
          <button @click="navigateToPortfolio"
            class="nav-pill flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Projects
          </button>
        </div>

        <div class="flex-1"></div>

        <!-- Right side controls -->
        <div class="flex items-center gap-3">
          <div v-if="showSearch">
            <SearchBar
              :modelValue="searchValue"
              @update:modelValue="handleSearchUpdate"
              :label="`Search ${activeCard}`"
              :placeholder="`Search in ${activeCard}...`"
            />
          </div>

          <!-- Theme toggle -->
          <button @click="toggleTheme"
            class="w-9 h-9 rounded-lg border border-color bg-modal-color-gradient icon-color transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-300 hover:shadow-[0_0_12px_rgba(99,102,241,0.2)] flex items-center justify-center group"
            :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <svg v-if="!isDarkMode" class="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>

          <Avatar />
        </div>
      </div>
    </nav>
  </div>
</template>
<style scoped>
/* Frosted glass navbar */
.navbar-bar {
  background: rgba(11, 13, 20, 0.82);
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

:global(:root:not(.dark)) .navbar-bar {
  background: rgba(244, 247, 255, 0.88);
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

/* Navigation pills */
.nav-pill {
  color: #7c8398;
  border: 1px solid transparent;
  background: transparent;
}

.nav-pill:hover {
  color: #818cf8;
  background: rgba(129, 140, 248, 0.1);
  border-color: rgba(129, 140, 248, 0.2);
}

:global(:root:not(.dark)) .nav-pill {
  color: #475569;
}

:global(:root:not(.dark)) .nav-pill:hover {
  color: #4f46e5;
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.2);
}
</style>