<template>
  <div class="portfolio-container p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-color mb-2">Projects</h1>
      <p class="text-gray-400 dark:text-gray-400">Select a project to view details</p>
    </div>

    <!-- Portfolio Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Project Card 1 - Ad Display Device -->
      <div 
        @click="selectProject(1)"
        class="bg-modal-color-gradient rounded-2xl shadow-sm overflow-hidden border border-color transition-all duration-300 hover:shadow-lg cursor-pointer group"
      >
        <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-color mb-2 transition-all duration-200">Ad Display Device</h3>
          <p class="text-gray-400 dark:text-gray-400 mb-4 transition-all duration-200">Containerized digital signage platform with real-time analytics</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">Docker</span>
            <span class="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">Vue.js</span>
          </div>
        </div>
      </div>

      <!-- Project Card 2 -->
      <div 
        @click="selectProject(2)"
        class="bg-modal-color-gradient rounded-2xl shadow-sm overflow-hidden border border-color transition-all duration-300 hover:shadow-lg cursor-pointer group"
      >
        <div class="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-color mb-2 transition-all duration-200">API Service</h3>
          <p class="text-gray-400 dark:text-gray-400 mb-4 transition-all duration-200">Backend API with Node.js and Express framework</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">Node.js</span>
            <span class="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">Express</span>
          </div>
        </div>
      </div>

      <!-- Project Card 3 -->
      <div 
        @click="selectProject(3)"
        class="bg-modal-color-gradient rounded-2xl shadow-sm overflow-hidden border border-color transition-all duration-300 hover:shadow-lg cursor-pointer group"
      >
        <div class="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-color mb-2 transition-all duration-200">Analytics Platform</h3>
          <p class="text-gray-400 dark:text-gray-400 mb-4 transition-all duration-200">Real-time data visualization and analytics</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">Analytics</span>
            <span class="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 rounded-full">Charts</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['project-selected']);

function selectProject(projectId) {
  emit('project-selected', projectId);
}
</script>

<style scoped>
.portfolio-container {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
