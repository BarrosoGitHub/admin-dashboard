<template>
  <div
    class="relative"
    @mouseenter="showDropdown = true"
    @mouseleave="showDropdown = false"
  >
    <div
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
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref } from "vue";

const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

defineExpose({ toggleDropdown });
</script>

<style scoped>
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
</style>
