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
        <!-- Multilevel Configuration -->
        <li>
          <button
            type="button"
            class="flex items-center w-full p-2 text-base transition duration-75 rounded-lg group hover:bg-gray-100 text-color dark:hover:bg-gray-700"
            @click="toggleConfigDropdown"
            aria-controls="dropdown-config"
            :aria-expanded="configDropdownOpen.toString()"
          >
            <svg class="shrink-0 w-5 h-5 transition duration-75 group-hover:text-color dark:group-hover:text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.01c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.01 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.01 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.01c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.01c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.01-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.01-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.246.07 2.573-1.01z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            </svg>
            <span class="flex-1 ms-3 text-left whitespace-nowrap">Configuration</span>
            <svg class="w-3 h-3 transition-transform" :class="configDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          <ul
            id="dropdown-config"
            class="py-2 space-y-2 transition-all duration-300 overflow"
            :class="configDropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'"
          >
            <li v-if="optConfigAvailable">
              <a
                href="#"
                class="flex items-center w-full p-2 text-color transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:hover:bg-gray-700"
                @click.prevent="fetchOptConfiguration"
              >
                OPT Configuration
              </a>
            </li>
            <li v-if="epsConfigAvailable">
              <a
                href="#"
                class="flex items-center w-full p-2 text-color transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:hover:bg-gray-700"
                @click.prevent="fetchEpsConfiguration"
              >
                EPS Configuration
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center w-full p-2 text-color transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:hover:bg-gray-700"
                @click.prevent="fetchUserInterfaceConfiguration"
              >
                User Interface
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center w-full p-2 text-color transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:hover:bg-gray-700"
                @click.prevent="fetchNetworkConfiguration"
              >
                Network
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
  'show-configuration-modal',
  'show-eps-configuration-modal',
  'sidebar-toggle',
  'opt-configuration',
  'eps-configuration',
  'user-interface-configuration',
  'dashboard',
  'network-configuration',
  'password-change'
]);

const showSidebar = ref(props.show);
const configDropdownOpen = ref(false);
const boardType = ref('');

function toggleConfigDropdown() {
  configDropdownOpen.value = !configDropdownOpen.value;
}

watch(
  () => props.show,
  (val) => {
    showSidebar.value = val;
  }
);

watch(showSidebar, (val) => {
  emit('sidebar-toggle', val);
});

function fetchOptConfiguration() {
  const token = localStorage.getItem('jwt');
  axios.get(`${API_BASE_URL}/opt-configuration`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(response => {
      emit('opt-configuration', response.data);
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        emit('show-opt-configuration-modal');
      }
    });
}

function fetchEpsConfiguration() {
  const token = localStorage.getItem('jwt');
  axios.get(`${API_BASE_URL}/eps-configuration`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(response => {
      emit('eps-configuration', response.data);
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        emit('show-eps-configuration-modal');
      }
    });
}

function fetchUserInterfaceConfiguration() {
  const token = localStorage.getItem('jwt');
  axios.get(`${API_BASE_URL}/configuration/ui`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(response => {
      emit('user-interface-configuration', response.data);
    })
    .catch(error => {
    });
}


function fetchNetworkConfiguration() {
  const token = localStorage.getItem('jwt');
  axios.get(`${API_BASE_URL}/configuration/network`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(response => {
      emit('network-configuration', response.data);
    })
    .catch(error => {
      emit('network-configuration', {
        dhcpActive: false,
        ntpActive: false,
        ipv4: '',
        netmask: '',
        gateway: '',
        ntpAddress: ''
      });
    });
}

function handleDashboardClick() {
  const token = localStorage.getItem('jwt');
  axios.get(`${API_BASE_URL}/info/services`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(response => {
      emit('dashboard', response.data);
    })
    .catch(error => {
      emit('dashboard', []);
    });
}

const optConfigAvailable = ref(false);

function checkOptConfigAvailable() {
  const token = localStorage.getItem('jwt');
  axios.get(`${API_BASE_URL}/opt-configuration/is-available`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(response => {
      // If API returns true or 200, show the menu item
      optConfigAvailable.value = response.data === true || response.data?.available === true;
    })
    .catch(error => {
      // Hide if 404 or any error
      optConfigAvailable.value = false;
    });
}

const epsConfigAvailable = ref(false);

function checkEpsConfigAvailable() {
  const token = localStorage.getItem('jwt');
  axios.get(`${API_BASE_URL}/eps-configuration/is-available`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(response => {
      // If API returns true or 200, show the menu item
      epsConfigAvailable.value = response.data === true || response.data?.available === true;
    })
    .catch(error => {
      // Hide if 404 or any error
      epsConfigAvailable.value = false;
    });
}


onMounted(() => {
  checkOptConfigAvailable();
  checkEpsConfigAvailable();

  window.addEventListener('sidebar-close', () => {
    showSidebar.value = false;
  });
  // Fetch board type for footer with Authorization
  const token = localStorage.getItem('jwt');
  axios.get(`${API_BASE_URL}/info/services/boardtype`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  }).then(res => {
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