<template>
  <div class="portfolio-container p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Portfolio</h1>
      <p class="text-gray-600 dark:text-gray-400">Showcase of my work and projects</p>
    </div>

    <!-- Portfolio Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Project Card 1 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Alpha</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">A modern web application built with Vue.js and Tailwind CSS</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">Vue.js</span>
            <span class="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">Tailwind</span>
          </div>
        </div>
      </div>

      <!-- Project Card 2 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Beta</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">API development with Node.js and Express framework</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">Node.js</span>
            <span class="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">Express</span>
          </div>
        </div>
      </div>

      <!-- Project Card 3 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Gamma</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Data visualization dashboard with real-time analytics</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">Analytics</span>
            <span class="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 rounded-full">Charts</span>
          </div>
        </div>
      </div>

      <!-- Project Card 4 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Delta</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Responsive design system and component library</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 rounded-full">Design</span>
            <span class="px-3 py-1 text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 rounded-full">UI/UX</span>
          </div>
        </div>
      </div>

      <!-- Project Card 5 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Epsilon</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Social platform with real-time messaging features</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">WebSocket</span>
            <span class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">Real-time</span>
          </div>
        </div>
      </div>

      <!-- Project Card 6 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="h-48 bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Zeta</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">E-commerce platform with payment integration</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full">E-commerce</span>
            <span class="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full">Payment</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Portfolio component - no props needed for now
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
