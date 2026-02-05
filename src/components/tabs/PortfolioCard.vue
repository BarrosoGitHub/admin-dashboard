<template>
  <div class="portfolio-container p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-color mb-2">Projects</h1>
      <p class="text-gray-400 dark:text-gray-400">Select a project to view details</p>
    </div>

    <!-- Portfolio Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Project Card 1 - Ad Display Device -->
      <div 
        id="project-1"
        ref="card1"
        @click="selectProject(1)"
        @mouseenter="hovering1 = true"
        @mouseleave="handleMouseLeave(1)"
        @mousemove="(e) => handleMouseMove(e, 1)"
        class="bg-modal-color-gradient rounded-2xl shadow-sm overflow-hidden border border-color cursor-pointer group portfolio-card"
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

      <!-- Project Card 5 - Necro Brawl Detailed -->
      <div 
        id="project-5"
        ref="card5"
        @click="selectProject(5)"
        @mouseenter="hovering5 = true"
        @mouseleave="handleMouseLeave(5)"
        @mousemove="(e) => handleMouseMove(e, 5)"
        class="bg-modal-color-gradient rounded-2xl shadow-sm overflow-hidden border border-color cursor-pointer group portfolio-card"
      >
        <div class="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold text-color mb-2 transition-all duration-200">Necro Brawl - Game Showcase</h3>
          <p class="text-gray-400 dark:text-gray-400 mb-4 transition-all duration-200">Stadium zombie survival with basketball tricks. Featured at Games Expo Edinburgh</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">3D Modeling</span>
            <span class="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 rounded-full">Textures</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['project-selected']);

const card1 = ref(null);
const card2 = ref(null);
const card3 = ref(null);
const card4 = ref(null);
const card5 = ref(null);
const hovering1 = ref(false);
const hovering2 = ref(false);
const hovering3 = ref(false);
const hovering4 = ref(false);
const hovering5 = ref(false);

const currentGradientStop = ref({ 1: 60, 2: 60, 3: 60, 4: 60, 5: 60 });
const targetGradientStop = ref({ 1: 60, 2: 60, 3: 60, 4: 60, 5: 60 });
const isAnimating = ref({ 1: false, 2: false, 3: false, 4: false, 5: false });

let gradientAnimationFrame = {};

function selectProject(projectId) {
  emit('project-selected', projectId);
}

function updateCardBackground(cardId) {
  const cardRef = cardId === 1 ? card1.value : cardId === 2 ? card2.value : cardId === 3 ? card3.value : cardId === 4 ? card4.value : card5.value;
  if (!cardRef) return;
  
  const isDark = document.documentElement.classList.contains('dark');
  const baseColor = isDark ? '#363636' : '#FFFFFF';
  const accentColor = isDark ? '#333333' : '#f3f3f3';
  cardRef.style.background = `linear-gradient(135deg, ${baseColor} 0%, ${baseColor} 60%, ${accentColor} 60%, ${accentColor} 100%)`;
}

let darkModeObserver;

onMounted(() => {
  // Observe dark mode class changes
  darkModeObserver = new MutationObserver(() => {
    updateCardBackground(1);
    updateCardBackground(2);
    updateCardBackground(3);
    updateCardBackground(4);
    updateCardBackground(5);
  });
  
  darkModeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});

onUnmounted(() => {
  if (darkModeObserver) {
    darkModeObserver.disconnect();
  }
  Object.values(gradientAnimationFrame).forEach(frame => {
    if (frame) cancelAnimationFrame(frame);
  });
});

// Smooth gradient stop animation with lag
function animateGradientStop(cardId) {
  const lagFactor = 0.15;
  const diff = targetGradientStop.value[cardId] - currentGradientStop.value[cardId];
  
  if (Math.abs(diff) > 0.01) {
    currentGradientStop.value[cardId] += diff * lagFactor;
    
    const cardRef = cardId === 1 ? card1.value : cardId === 2 ? card2.value : cardId === 3 ? card3.value : cardId === 4 ? card4.value : card5.value;
    if (cardRef) {
      const isDark = document.documentElement.classList.contains('dark');
      const baseColor = isDark ? '#363636' : '#FFFFFF';
      const accentColor = isDark ? '#333333' : '#f3f3f3';
      
      cardRef.style.background = `linear-gradient(135deg, ${baseColor} 0%, ${baseColor} ${currentGradientStop.value[cardId]}%, ${accentColor} ${currentGradientStop.value[cardId]}%, ${accentColor} 100%)`;
    }
    
    if (isAnimating.value[cardId]) {
      gradientAnimationFrame[cardId] = requestAnimationFrame(() => animateGradientStop(cardId));
    }
  } else {
    isAnimating.value[cardId] = false;
  }
}

function handleMouseMove(event, cardId) {
  const cardRef = cardId === 1 ? card1.value : cardId === 2 ? card2.value : cardId === 3 ? card3.value : cardId === 4 ? card4.value : card5.value;
  if (!cardRef) return;
  
  const rect = cardRef.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = ((y - centerY) / centerY) * -10;
  const rotateY = ((x - centerX) / centerX) * 10;
  
  const normalizedX = (x - centerX) / centerX;
  const normalizedY = (y - centerY) / centerY;
  
  targetGradientStop.value[cardId] = 70 + (normalizedX * -9) + (normalizedY * 1);
  
  if (!isAnimating.value[cardId]) {
    isAnimating.value[cardId] = true;
    animateGradientStop(cardId);
  }
  
  const scale = 1.02;
  cardRef.style.transition = 'transform 0.35s cubic-bezier(0.34, .56, 0.64, 1)';
  cardRef.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
}

function handleMouseLeave(cardId) {
  const cardRef = cardId === 1 ? card1.value : cardId === 2 ? card2.value : cardId === 3 ? card3.value : cardId === 4 ? card4.value : card5.value;
  if (cardId === 1) hovering1.value = false;
  if (cardId === 2) hovering2.value = false;
  if (cardId === 3) hovering3.value = false;
  if (cardId === 4) hovering4.value = false;
  if (cardId === 5) hovering5.value = false;
  
  if (!cardRef) return;
  
  targetGradientStop.value[cardId] = 60;
  
  if (!isAnimating.value[cardId]) {
    isAnimating.value[cardId] = true;
    animateGradientStop(cardId);
  }
  
  cardRef.style.transition = 'transform 0.75s cubic-bezier(0.34, 2.56, 0.64, 1)';
  cardRef.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
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

.portfolio-card {
  transition: box-shadow 0.3s, background 0.3s;
  transform-style: preserve-3d;
  will-change: transform, background;
}
</style>
