<template>
  <button
    type="button"
    :disabled="disabled || isLoading"
    :class="[
      'text-white font-medium rounded-3xl text-sm py-2.5 me-2 mb-2 focus:ring-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[44px] transition-all duration-500',
      showTick 
        ? 'tick-button-color w-[45px]' 
        : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-[120px]'
    ]"
    @click="$emit('confirm')"
  >
    <span v-if="!showTick && !isLoading">{{ label }}</span>
    <span v-if="isLoading" class="loader"></span>
    <svg
      v-if="showTick"
      class="w-6 h-6 text-green-500"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="{ 'tick-animate': showTick }"
        d="M5 13l4 4L19 7"
      />
    </svg>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import '@/assets/main.css';
const props = defineProps({
  label: { type: String, default: "Confirm" },
  isLoading: { type: Boolean, default: false },
  showTick: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
defineEmits(["confirm"]);
</script>

<style scoped>
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes tick-draw {
  0% {
    stroke-dashoffset: 24;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
.tick-animate {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: tick-draw 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  stroke: var(--tick-stroke-color, #22c55e); /* fallback to green-500 */
}
</style>
