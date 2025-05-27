<template>
  <form class="max-w-none mx-0" @submit="onSubmit">
    <label
      for="default-search"
      class="mb-1 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >{{ label }}</label
    >
    <div class="absolute right-80 flex justify-start">
      <div class="absolute inset-y-4 end-3.5 flex items-center pe-0 pointer-events-none">
        <svg
          class="w-3 h-3 text-gray-500 dark:text-gray-400 "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        id="default-search"
        :class="[
          'block transition-all duration-300 min-w-0 text-right',
          isFocused ? 'w-40 h-10.5 p-2 pe-8 text-sm' : 'w-8 h-10.5 p-2 pe-8 text-sm cursor-pointer'
        ]"
        class="text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        :placeholder="isFocused ? placeholder : ''"
        :value="modelValue"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        required
      />
    </div>
  </form>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Search Mockups, Logos...",
  },
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Search",
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);
const isFocused = ref(false);

function onInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>
