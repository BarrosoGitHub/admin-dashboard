<script setup>
  import Avatar from '../Avatar.vue';
</script>

<template>
  
  <div class="inset-shadow-indigo-900">

    <nav class="border-white-200  ">
            

      <div class="flex items-center justify-start p-3 z-50">
        <button
          type="button"
          @click="$emit('sidebar-toggle')"
          class="inline-flex items-center justify-center p-0.5 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-100"
          aria-controls="navbar-hamburger"
          aria-expanded="false"
          style="z-index: 1002; position: relative;"
        >
          <span class="sr-only">Open Sidebar</span>
          <svg
            class="w-5 h-5"
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
        </button>
        <div class="flex-1"></div>
        <div class="flex justify-end ">
          <Avatar />
        </div>
      </div>

    </nav>
  </div>
</template>
