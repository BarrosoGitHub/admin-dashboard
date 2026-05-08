<template>
  <div class="portfolio-container p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-1">
        <div class="w-1 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
        <h1 class="text-3xl font-bold text-color">Projects</h1>
      </div>
      <p class="text-gray-500 dark:text-gray-400 ml-4 text-sm">Select a project to explore</p>
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
        class="bg-modal-color-gradient rounded-2xl overflow-hidden border border-color cursor-pointer group portfolio-card transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.18)]"
      >
        <!-- Banner -->
        <div class="h-44 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500">
          <!-- Grid pattern overlay -->
          <div class="absolute inset-0 banner-grid opacity-20"></div>
          <!-- Glow orb -->
          <div class="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"></div>
          <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
          <!-- Icon -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
              <svg class="w-10 h-10 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
          </div>
          <!-- Live badge -->
          <div class="absolute top-3 right-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
            <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span class="text-[10px] font-semibold text-white/80 tracking-wider">LIVE DEMO</span>
          </div>
        </div>

        <div class="p-4">
          <h3 class="text-base font-bold text-color mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200">Ad Display Device</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">Containerized digital signage on ARM64 with real-time analytics</p>
          <div class="flex flex-wrap gap-1.5">
            <span class="tag tag-blue">Docker</span>
            <span class="tag tag-indigo">ARM64</span>
            <span class="tag tag-purple">Vue.js</span>
            <span class="tag tag-cyan">.NET</span>
          </div>
        </div>
      </div>

      <!-- Project Card 5 - Necro Brawl -->
      <div 
        id="project-5"
        ref="card5"
        @click="selectProject(5)"
        @mouseenter="hovering5 = true"
        @mouseleave="handleMouseLeave(5)"
        @mousemove="(e) => handleMouseMove(e, 5)"
        class="bg-modal-color-gradient rounded-2xl overflow-hidden border border-color cursor-pointer group portfolio-card transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(168,85,247,0.18)]"
      >
        <!-- Banner -->
        <div class="h-44 relative overflow-hidden bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-500">
          <div class="absolute inset-0 banner-grid opacity-20"></div>
          <div class="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"></div>
          <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
              <svg class="w-10 h-10 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <div class="absolute top-3 right-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
            <span class="text-[10px] font-semibold text-white/80 tracking-wider">GAME</span>
          </div>
        </div>

        <div class="p-4">
          <h3 class="text-base font-bold text-color mb-1.5 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-200">Necro Brawl</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">Stadium zombie survival with basketball. Featured at Games Expo Edinburgh</p>
          <div class="flex flex-wrap gap-1.5">
            <span class="tag tag-purple">3D Modeling</span>
            <span class="tag tag-pink">Textures</span>
            <span class="tag tag-fuchsia">Game Design</span>
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
  animation: fadeIn 0.35s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.portfolio-card {
  transform-style: preserve-3d;
  will-change: transform;
}

/* Dot-grid banner pattern */
.banner-grid {
  background-image: radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Tech stack tags */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;
}
.tag-blue    { background: rgba(59,130,246,0.12);  color: #93c5fd; border-color: rgba(59,130,246,0.25); }
.tag-indigo  { background: rgba(99,102,241,0.12);  color: #a5b4fc; border-color: rgba(99,102,241,0.25); }
.tag-purple  { background: rgba(168,85,247,0.12);  color: #d8b4fe; border-color: rgba(168,85,247,0.25); }
.tag-cyan    { background: rgba(6,182,212,0.12);   color: #67e8f9; border-color: rgba(6,182,212,0.25); }
.tag-pink    { background: rgba(236,72,153,0.12);  color: #f9a8d4; border-color: rgba(236,72,153,0.25); }
.tag-fuchsia { background: rgba(217,70,239,0.12);  color: #e879f9; border-color: rgba(217,70,239,0.25); }

/* Light mode overrides — darker text for legibility on white cards */
:global(:root:not(.dark)) .tag-blue    { background: rgba(59,130,246,0.08);  color: #1d4ed8; border-color: rgba(59,130,246,0.3); }
:global(:root:not(.dark)) .tag-indigo  { background: rgba(99,102,241,0.08);  color: #4338ca; border-color: rgba(99,102,241,0.3); }
:global(:root:not(.dark)) .tag-purple  { background: rgba(168,85,247,0.08);  color: #7e22ce; border-color: rgba(168,85,247,0.3); }
:global(:root:not(.dark)) .tag-cyan    { background: rgba(6,182,212,0.08);   color: #0e7490; border-color: rgba(6,182,212,0.3); }
:global(:root:not(.dark)) .tag-pink    { background: rgba(236,72,153,0.08);  color: #be185d; border-color: rgba(236,72,153,0.3); }
:global(:root:not(.dark)) .tag-fuchsia { background: rgba(217,70,239,0.08);  color: #a21caf; border-color: rgba(217,70,239,0.3); }
</style>
