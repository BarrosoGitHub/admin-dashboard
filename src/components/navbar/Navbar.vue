<script setup>
  import Avatar from '../Avatar.vue';
  import SearchBar from '../searchbar/SearchBar.vue';
  import { ref } from 'vue';
  
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
  
  const emit = defineEmits(['sidebar-toggle', 'password-change', 'search-update']);
  
  const isHovered = ref(false);
  
  function handlePasswordChange() {
    emit('password-change');
  }
  
  function handleSearchUpdate(value) {
    emit('search-update', value);
  }

  function handleSidebarToggle() {
    isHovered.value = false; // Reset hover state after click
    emit('sidebar-toggle');
  }
</script>

<template>
  
  <div class="inset-shadow-indigo-900">

    <nav class="border-white-200  ">
            

      <div class="flex items-center justify-start py-5 p-8 z-50">
        <button
          type="button"
          @click="handleSidebarToggle"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          class="inline-flex items-center justify-center p-0.5 w-12 h-12 text-sm icon-color rounded-full bg-modal-color transition-all duration-200 hover:scale-105 relative overflow-hidden"
          aria-controls="navbar-hamburger"
          aria-expanded="false"
          style="z-index: 1002; position: relative;"
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
          OPT name [PH]
        </div>
        <div class="flex-1"></div>
        <div class="flex justify-end items-center gap-8">
          <div v-if="showSearch">
            <SearchBar
              :modelValue="searchValue"
              @update:modelValue="handleSearchUpdate"
              :label="`Search ${activeCard}`"
              :placeholder="`Search in ${activeCard}...`"
            />
          </div>
          <Avatar @password-change="handlePasswordChange" />
        </div>
      </div>

    </nav>
  </div>
</template>
