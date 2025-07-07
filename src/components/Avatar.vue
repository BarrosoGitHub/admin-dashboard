<template>
  <div
    ref="avatarRef"
    class="relative w-12 h-12 overflow-hidden border border-color bg-modal-color rounded-full cursor-pointer"
    @click="toggleDropdown"
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
  <!-- Dropdown menu -->
  <div
      ref="dropdownRef"
      id="userDropdown"
      :class="[
        'z-170 absolute right-8 top-20 mt-2 bg-modal-color divide-y divide-neutral-700 rounded-lg shadow-sm w-44 border border-color shadow-xl',
        showDropdown ? '' : 'hidden'
      ]"
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
          @click.prevent="handleChangePassword"
          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >Change Password</a
        >
      </li>
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
    <div class="py-1">
      <a
        href="#"
        @click.prevent="handleSignOut"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        >Sign out</a
      >
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(['password-change']);

const showDropdown = ref(false);
const router = useRouter();
const isDarkMode = ref(true); // Default to dark mode since the app appears to be dark themed
const dropdownRef = ref(null);
const avatarRef = ref(null);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function handleChangePassword() {
  showDropdown.value = false; // Close dropdown
  emit('password-change');
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

function handleClickOutside(event) {
  if (dropdownRef.value && avatarRef.value) {
    // Check if click is outside both the dropdown and the avatar button
    if (!dropdownRef.value.contains(event.target) && !avatarRef.value.contains(event.target)) {
      showDropdown.value = false;
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
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
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

async function handleSignOut() {
  const event = new CustomEvent('sidebar-close');
  window.dispatchEvent(event);
  setTimeout(() => {
    localStorage.removeItem('jwt');
    router.push('/login');
  }, 300); // Match sidebar close animation duration
}

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
</style>
