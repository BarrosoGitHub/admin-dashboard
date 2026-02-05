<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-color">Necro Brawl - Game Showcase</h2>
        <p class="text-gray-400 dark:text-gray-400 mt-2">Stadium zombie survival with basketball tricks</p>
      </div>
      <button 
        @click="$emit('back')"
        class="px-4 py-2 bg-modal-color-gradient border border-color rounded-lg text-color hover:shadow-lg transition-all duration-200"
      >
        ← Back to Projects
      </button>
    </div>

    <!-- Game Description Section -->
    <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-8 transition-all duration-300 hover:shadow-lg">
      <div class="flex items-start gap-4 mb-6">
        <div class="p-3 bg-gradient-to-br from-orange-400 to-red-600 rounded-full">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-color mb-4">About the Game</h3>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            I'm proud to present my latest game in development, <span class="font-semibold text-orange-500">Necro Brawl</span>. 
            Initially conceived as a final coursework project to be developed in two and a half months, it recently garnered 
            praise for its unique style and addictive gameplay at <span class="font-semibold">Games Expo Edinburgh</span>.
          </p>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            In Necro Brawl, players are stranded in a stadium during a zombie apocalypse and must use a basketball to fend off the undead. 
            Performing tricks increases the style/bounce meter, allowing the ball to target more zombies with each shot.
          </p>
        </div>
      </div>
    </div>

    <!-- Key Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-purple-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-color mb-2">Trick-Based Combat</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Perform basketball tricks to power up your attacks and increase combo multipliers</p>
          </div>
        </div>
      </div>

      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-orange-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-color mb-2">Style Meter System</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Build your bounce meter to target multiple zombies with devastating chain attacks</p>
          </div>
        </div>
      </div>

      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-red-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-color mb-2">Stadium Arena</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Fight through waves of zombies in an atmospheric stadium environment</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Development Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Technical Stack -->
      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg">
        <h3 class="text-xl font-bold text-color mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
          Technical Stack
        </h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span class="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full">Unity Engine</span>
            <span class="text-sm text-gray-600 dark:text-gray-300">Game Development Framework</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span class="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">C#</span>
            <span class="text-sm text-gray-600 dark:text-gray-300">Game Logic & Systems</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span class="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 rounded-full">3D Modeling</span>
            <span class="text-sm text-gray-600 dark:text-gray-300">Custom Assets & Textures</span>
          </div>
        </div>
      </div>

      <!-- Project Stats -->
      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg">
        <h3 class="text-xl font-bold text-color mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
          </svg>
          Project Highlights
        </h3>
        <div class="space-y-4">
          <div class="border-l-4 border-orange-500 pl-4">
            <div class="text-2xl font-bold text-color">2.5 Months</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Development Timeline</div>
          </div>
          <div class="border-l-4 border-purple-500 pl-4">
            <div class="text-2xl font-bold text-color">Coursework Project</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Academic Achievement</div>
          </div>
          <div class="border-l-4 border-pink-500 pl-4">
            <div class="text-2xl font-bold text-color">Games Expo Edinburgh</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Featured & Praised</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Models & Textures Section -->
    <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-8 transition-all duration-300 hover:shadow-lg">
      <h3 class="text-2xl font-bold text-color mb-6 flex items-center gap-2">
        <svg class="w-7 h-7 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
        </svg>
        Models & Textures
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <h4 class="font-semibold text-color mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
            Custom 3D Assets
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Hand-crafted 3D models for characters, environment, and props. Each asset is optimized for performance while maintaining visual quality.
          </p>
        </div>
        <div class="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
          <h4 class="font-semibold text-color mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
            Texture Design
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Unique texture work that brings the zombie apocalypse setting to life with detailed materials and atmospheric lighting.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

defineEmits(['back']);
</script>

<style scoped>
/* Smooth animations */
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
