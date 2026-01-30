<template>
  <div>
    <div
      ref="cardElement"
      class="bg-modal-color-gradient rounded-2xl flex flex-col transition-all duration-300 overflow-hidden m-4 p-4 border border-color group relative appinfocard-anim"
      :class="[
        hovering ? 'shadow-lg' : 'shadow-sm',
        smallVersion
          ? (hovering
              ? 'min-w-[350px] min-h-[120px] max-w-xs scale-100 z-50'
              : 'min-w-[350px] min-h-[60px] max-w-xs scale-100')
          : 'max-w-[320px] min-h-[240px]'
      ]"
      :style="smallVersion ? (hovering ? 'height: 200px;' : 'height: 160px;') : ''"
      @mouseenter="hovering = true"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove"
    >
      <div
        class="w-full flex items-center justify-between cursor-pointer select-none mb-3 "
        :aria-expanded="true"
        :aria-controls="'app-info-body'"
        role="button"
        tabindex="0"
      >
        <div class="contents items-center ">
          <div class="w-10 h-10 rounded-full bg-neutral-300 contents items-center justify-center shadow ">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
          <div style="min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; width: 100%; height: 2.5em;"
            :class="[
              'p-2 transition-all duration-300 ',
              hovering ? 'items-center justify-center' : '',
              info.Status === 'Stopped' ? 'text-neutral-500 text-bold' : 'text-color'
            ]"
          >
            <div class="leading-tight max-w-full my-2 transition-all duration-200"
              :class="['py-2',
                hovering ? 'text-lg ' : 'text-2xl ',
                info.Status === 'Stopped' ? 'text-neutral-500 dark:text-neutral-500' : 'text-color'
              ]"
              style="line-height: 1; height: 1.2em;"
            >{{ info.Id }}</div>
            <div class="leading-tight max-w-full transition-all duration-200"
              :class="[
                hovering ? 'text-sm' : 'text-md',
                info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color'
              ]"
              style="line-height: 1; height: 1.3em;"
            >Status: <span :class="(info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color')">{{ info.Status }}</span></div>
          </div>
        </div>
      </div>
      <transition name="fade-slide">
        <div
          class="grid grid-cols-3 gap-x-4 gap-y-2 text-xs group"
          style="min-height: 80px; max-height: 100px;"
        >
          <div class="flex flex-col gap-1 px-2 py-4 items-center justify-center h-full">
            <span class="flex items-center justify-center gap-1 transition-all group-hover:translate-y-0 translate-y-7 opacity-0 group-hover:opacity-100 duration-150"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-400'"
              style="min-height:48px;"
            >
              <div class="p-4 -m-4">
                <component :is="iconMap.Hash" class="w-6 h-6 transition-transform duration-200 hover:scale-125" :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color'" />
              </div>
            </span>
            <span class="font-semibold break-all text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color'"
            >
              {{ info.Hash }}
            </span>
          </div>
          <div class="flex flex-col gap-1 px-2 py-4 items-center justify-center h-full">
            <span class="flex items-center justify-center gap-1 transition-all group-hover:translate-y-0 translate-y-7 opacity-0 group-hover:opacity-100 duration-300"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-400'"
              style="min-height:48px;"
            >
              <div class="p-4 -m-4">
                <component :is="iconMap.Version" class="w-6 h-6 transition-transform duration-200 hover:scale-125" :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color'" />
              </div>
            </span>
            <span class="font-semibold break-all text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color'"
            >
              {{ info.Version }}
            </span>
          </div>
          <div class="flex flex-col gap-1 px-2 py-4 items-center justify-center h-full ">
            <span class="flex items-center justify-center gap-1 transition-all group-hover:translate-y-0 translate-y-7 opacity-0 group-hover:opacity-100 duration-450"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-400'"
              style="min-height:48px;"
            >
              <div class="p-4 -m-4">
                <component :is="iconMap.StartUpTime" class="w-6 h-6 transition-transform duration-200 hover:scale-125" :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color'" />
              </div>
            </span>
            <span class="font-semibold break-all text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color'"
            >
              {{ formatDate(info.StartUpTime) }}
            </span>
          </div>
          <div class="col-span-3 mt-1 pt-2 flex flex-col gap-1 px-2 items-center">
            <span class="font-semibold break-all text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color'"
            >
              {{ info.Message }}
            </span>
          </div>
        </div>
      </transition>
      <span
        :class="[
          'flex items-center justify-end w-full transition-all duration-200',
          'absolute right-4 bottom-4',
          hovering ? 'opacity-0 translate-y-1' : 'opacity-100',
          info.Status === 'Stopped' ? 'text-neutral-500' : 'text-color'
        ]"
      >
        <div class="p-4 -m-4">
          <CheckCircleIcon v-if="info.Status === 'Healthy'" class="h-10 w-10 transition-transform duration-200 hover:scale-110" />
          <ExclamationTriangleIcon v-else class="h-10 w-10 transition-transform duration-200 hover:scale-110" />
        </div>
      </span>
    </div>
  </div>

</template>

<script setup>
import { defineProps, ref, onMounted, onUnmounted } from "vue";
import {
  TagIcon,
  ClockIcon,
  CpuChipIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const iconMap = {
  Version: TagIcon,
  StartUpTime: ClockIcon,
  Hash: CpuChipIcon
};

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
  smallVersion: {
    type: Boolean,
    default: true
  }
});

const hovering = ref(false);
const cardElement = ref(null);
const currentGradientStop = ref(60); // Track current gradient stop for smooth lagging
const targetGradientStop = ref(60);
const isAnimating = ref(false); // Track if animation is active

// Watch for dark mode changes
function updateCardBackground() {
  if (!cardElement.value || props.smallVersion) return;
  
  const isDark = document.documentElement.classList.contains('dark');
  const baseColor = isDark ? '#363636' : '#FFFFFF';
  const accentColor = isDark ? '#333333' : '#f3f3f3';
  cardElement.value.style.background = `linear-gradient(135deg, ${baseColor} 0%, ${baseColor} 60%, ${accentColor} 60%, ${accentColor} 100%)`;
}

let darkModeObserver;
let gradientAnimationFrame;

onMounted(() => {
  // Observe dark mode class changes
  darkModeObserver = new MutationObserver(() => {
    updateCardBackground();
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
  if (gradientAnimationFrame) {
    cancelAnimationFrame(gradientAnimationFrame);
  }
});

// Smooth gradient stop animation with lag
function animateGradientStop() {
  // Lerp towards target with lag factor (0.15 = slower, 0.3 = faster)
  const lagFactor = 0.15;
  const diff = targetGradientStop.value - currentGradientStop.value;
  
  // Only update if difference is significant (optimization)
  if (Math.abs(diff) > 0.01) {
    currentGradientStop.value += diff * lagFactor;
    
    // Update background continuously with current gradient stop
    if (cardElement.value && !props.smallVersion) {
      const isDark = document.documentElement.classList.contains('dark');
      const baseColor = isDark ? '#363636' : '#FFFFFF';
      const accentColor = isDark ? '#333333' : '#f3f3f3';
      
      cardElement.value.style.background = `linear-gradient(135deg, ${baseColor} 0%, ${baseColor} ${currentGradientStop.value}%, ${accentColor} ${currentGradientStop.value}%, ${accentColor} 100%)`;
    }
    
    if (isAnimating.value) {
      gradientAnimationFrame = requestAnimationFrame(animateGradientStop);
    }
  } else {
    // Snap to target when close enough
    currentGradientStop.value = targetGradientStop.value;
    isAnimating.value = false;
  }
}

function handleMouseMove(e) {
  if (!cardElement.value || props.smallVersion) return;
  
  const rect = cardElement.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Normalize to -1 to 1 range
  const normalizedX = -(x - centerX) / centerX;
  const normalizedY = -(y - centerY) / centerY;
  
  // Apply dampening to reduce extreme rotations at edges
  const dampenedX = Math.sign(normalizedX) * Math.pow(Math.abs(normalizedX), 0.4);
  const dampenedY = Math.sign(normalizedY) * Math.pow(Math.abs(normalizedY), 0.4);
  
  const rotateX = dampenedY * -15;
  const rotateY = dampenedX * 15;
  
  // Calculate gradient angle based on mouse position (135deg base + offset)
  const gradientAngle = 135 + (normalizedX * -3) + (normalizedY * 1);
  
  // Adjust gradient color stop based on mouse position (60-80% range)
  targetGradientStop.value = 70 + (normalizedX * -9) + (normalizedY * 1);
  
  // Start animation loop if not already running
  if (!isAnimating.value) {
    isAnimating.value = true;
    animateGradientStop();
  }
  
  // Update transform only here, background is updated by animateGradientStop
  cardElement.value.style.transition = 'transform 0.2s ease-out';
  cardElement.value.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function handleMouseLeave() {
  hovering.value = false;
  if (!cardElement.value || props.smallVersion) return;
  
  // Reset target gradient stop (will animate smoothly via animateGradientStop)
  targetGradientStop.value = 60;
  
  // Start animation loop if not already running
  if (!isAnimating.value) {
    isAnimating.value = true;
    animateGradientStop();
  }
  
  cardElement.value.style.transition = 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  cardElement.value.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
}

function formatDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString();
}
</script>

<style scoped>
.bg-white {
  background: #fff;
}
.shadow-md {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
}
.appinfocard-anim {
  transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s, background 0.3s, min-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease-out;
  transform-style: preserve-3d;
  will-change: transform, background;
}
</style>
