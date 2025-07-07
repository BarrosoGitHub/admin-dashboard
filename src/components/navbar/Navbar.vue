<script setup>
  import Avatar from '../Avatar.vue';
  import SearchBar from '../searchbar/SearchBar.vue';
  
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
    }
  });
  
  const emit = defineEmits(['sidebar-toggle', 'password-change', 'search-update']);
  
  function handlePasswordChange() {
    emit('password-change');
  }
  
  function handleSearchUpdate(value) {
    emit('search-update', value);
  }
</script>

<template>
  
  <div class="inset-shadow-indigo-900">

    <nav class="border-white-200  ">
            

      <div class="flex items-center justify-start py-5 p-8 z-50">
        <button
          type="button"
          @click="$emit('sidebar-toggle')"
          class="inline-flex items-center justify-center p-0.5 w-12 h-12 text-sm icon-color rounded-full bg-modal-color"
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
