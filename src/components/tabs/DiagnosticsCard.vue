<template>
  <div class="m-5 p-8 rounded-2xl shadow-inner bg-modal-color border border-color flex flex-col shadow-md">
    <div class="flex items-center mb-6">
      <svg class="w-10 h-10 text-white mr-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12h4l2 7 4-14 2 7h4" />
      </svg>
      <h2 class="text-2xl font-bold text-white">Diagnostics</h2>
    </div>
    
    <div class="mt-6 text-xs text-gray-200 text-right">* Mock data for demo</div>
  </div>
</template>

<script setup>
import StatusElementCard from './StatusElementCard.vue';
const diagnostics = {
  cpuTemp: 54,
  ramUsage: 62,
  diskSpace: 78,
};
</script>
