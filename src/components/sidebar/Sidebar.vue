<template>

<div class="bg-white rounded ">

  <!-- Sidebar -->
  <aside
  :class="[
    'fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800',
    'transition-transform duration-200 ease-in-out sidebar-shadow',
    showSidebar ? 'translate-x-0' : '-translate-x-full'
  ]"
>
  
    <div class="flex justify-between items-center mb-6 " >
      <h5 class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
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
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            @click.prevent="fetchOptConfiguration"
          >
            <svg class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 18 18">
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">OPT Configuration</span>
          </a>
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
const emit = defineEmits(['show-configuration-modal', 'sidebar-toggle', 'opt-configuration']);

// Use the prop to control sidebar visibility
const showSidebar = ref(props.show);

// Keep showSidebar in sync with the prop
watch(
  () => props.show,
  (val) => {
    showSidebar.value = val;
  }
);

// Emit sidebar state changes to parent if closed from inside
watch(showSidebar, (val) => {
  emit('sidebar-toggle', val);
});

function fetchOptConfiguration() {
  axios.get('http://localhost:5087/configuration/opt')
    .then(response => {
      console.log('OPT Configuration:', response.data);
      emit('opt-configuration', response.data);
    })
    .catch(error => {
      console.error('Error fetching OPT Configuration:', error);
      if (error.response && error.response.status === 404) {
        emit('show-configuration-modal');
      }
    });
}
</script>