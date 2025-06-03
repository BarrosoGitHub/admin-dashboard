<template>

<div class="bg-white rounded ">

  <!-- Sidebar -->
  <aside
    :class=" [
      'fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto bg-sidebar-color',
      'transition-transform duration-200 ease-in-out ',
      showSidebar ? 'translate-x-0 sidebar-shadow' : '-translate-x-full'
    ]"
    aria-label="Sidebar"
  >
    <!-- Petrotec Icon -->
    <div class="flex justify-center items-center mb-8">
      <img
        src="@/assets/Petrotec-icon.png"
        alt="Petrotec Icon"
        class="h-12 w-auto"
      />
    </div>
    <!-- Add a horizontal line below the icon -->
    <hr class="border-gray-600 mb-2 border-color" />
    <div class="flex justify-between items-center " >
    </div>
    <div class="py-4 overflow-y-auto ">
      <ul class="space-y-2 font-medium">
        <li>
          <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 22 21">
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
            class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            @click="toggleConfigDropdown"
            aria-controls="dropdown-config"
            :aria-expanded="configDropdownOpen.toString()"
          >
            <!-- Changed icon to a settings/gear icon -->
            <svg class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
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
            class="py-2 space-y-2"
            :class="configDropdownOpen ? '' : 'hidden'"
          >
            <li>
              <a
                href="#"
                class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                @click.prevent="fetchOptConfiguration"
              >
                OPT Configuration
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                @click.prevent="fetchUserInterfaceConfiguration"
              >
                User Interface
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                @click.prevent="fetchNetworkConfiguration"
              >
                Network
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</div>

</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits([
  'show-configuration-modal',
  'sidebar-toggle',
  'opt-configuration',
  'user-interface-configuration'
]);

const showSidebar = ref(props.show);
const configDropdownOpen = ref(false);

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
  axios.get('http://localhost:5087/configuration/opt')
    .then(response => {
      emit('opt-configuration', response.data);
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        emit('show-configuration-modal');
      }
    });
}

function fetchUserInterfaceConfiguration() {
  axios.get('http://localhost:5087/configuration/ui')
    .then(response => {
      emit('user-interface-configuration', response.data);
    })
    .catch(error => {
    });
}

function fetchNetworkConfiguration() {
  // TODO: Implement network configuration fetch logic
  alert('Network configuration clicked!');
}
</script>