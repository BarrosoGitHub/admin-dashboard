<template>
  <div 
    ref="cardElement"
    class="status-element-card h-[160px] py-5 my-4 rounded-2xl shadow-inner bg-modal-color-gradient border border-color justify-between shadow-md transition-all duration-300"
    :class="[
        hovering ? 'shadow-lg' : 'shadow-sm', 
        hovering
              ? 'px-4 max-w-[375px]  z-50'
              : 'px-6 flex flex-row w-[375px]'
      ]"
      @mouseenter="onMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove">
    <div class="flex items-center ">
      <div class="p-4 -m-4">
        <component :is="iconComponent" class="w- h-7 text-color opacity-80 mr-3 transition-transform duration-200 hover:scale-110" />
      </div>
      <span class="text-lg text-color font-semibold">{{ title }}</span>
    </div>
    <div class="flex items-center py-2">
      <svg v-if="!hovering" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="progress-circle mr-2">
        <circle
          :cx="size/2"
          :cy="size/2"
          :r="radius"
          fill="none"
          stroke="#475569"
          :stroke-width="stroke"
          :style="{ opacity: 0.18 }"
        />
        <circle
          :cx="size/2"
          :cy="size/2"
          :r="radius"
          fill="none"
          :stroke="progressColor"
          :stroke-width="stroke"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
          stroke-linecap="round"
          style="transition: stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1), stroke 1.5s cubic-bezier(0.4,0,0.2,1);"
        />
        <text
          :x="size/2"
          :y="size/2 + 7"
          text-anchor="middle"
          fill="currentColor"
          font-size="18"
          font-family="monospace"
          class="text-color-secondary"
        >
          {{ props.mainValue }}
        </text>
      </svg>
      <div v-else class="my-2 grid grid-cols-2 mr-4 gap-x-2 gap-y-2">
        <template v-if="Array.isArray(props.secondaryValues)">
          <div v-for="(val, idx) in props.secondaryValues" :key="idx" class="">
            <HorizontalProgressBar
              :value="val.split(':')[1].trim()"
              :type="props.type"
              :label="(typeof val === 'string' && val.includes(':')) ? val.split(':')[0].trim() : ''"
              :animate="hovering"
              :maxValue="props.maxValue"
            />
          </div>
        </template>
        <template v-else>
          <span class="text-color text-sm font-mono flex justify-center w-full">{{ props.secondaryValues }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HorizontalProgressBar from './HorizontalProgressBar.vue';
import {
  TagIcon,
  ClockIcon,
  CpuChipIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ServerStackIcon,
  ComputerDesktopIcon,
} from '@heroicons/vue/24/outline';

const iconMap = {
  cpu: CpuChipIcon,
  ram: TagIcon,
  memory: TagIcon,
  disk: ClockIcon,
  space: ClockIcon,
  ok: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
};

const props = defineProps({
  title: String,
  value: Number,
  valueDisplay: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 64
  },
  stroke: {
    type: Number,
    default: 8
  },
  mainValue: {
    type: [String, Number],
    default: ''
  },
  secondaryValues: {
    type: [Array, String],
    default: ''
  },
  type: {
    type: String,
    default: 'other'
  },
  maxValue: {
    type: [String, Number],
    default: 100
  },
});
const hovering = ref(false);
const cardElement = ref(null);
const currentGradientStop = ref(60); // Track current gradient stop for smooth lagging
const targetGradientStop = ref(60);
const isAnimating = ref(false); // Track if animation is active

const radius = computed(() => (props.size - props.stroke) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const progressOffset = computed(() => {
  const percent = Math.max(0, Math.min(100, props.value));
  return circumference.value * (1 - percent / 100);
});
const progressColor = computed(() => {
  const start = { r: 74, g: 222, b: 128 };
  const end = { r: 248, g: 113, b: 113 };
  const t = Math.max(0, Math.min(1, props.value / 100));
  const r = Math.round(start.r + (end.r - start.r) * t);
  const g = Math.round(start.g + (end.g - start.g) * t);
  const b = Math.round(start.b + (end.b - start.b) * t);
  return `rgb(${r},${g},${b})`;
});

const iconComponent = computed(() => {
  const key = props.title?.toLowerCase() || '';
  if (key.includes('cpu')) return CpuChipIcon;
  if (key.includes('ram') || key.includes('memory')) return ComputerDesktopIcon;
  if (key.includes('disk') || key.includes('space')) return ServerStackIcon;
  if (key.includes('ok')) return CheckCircleIcon;
  if (key.includes('warn')) return ExclamationTriangleIcon;
  return TagIcon;
});

// Watch for dark mode changes
function updateCardBackground() {
  if (!cardElement.value) return;
  
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
    if (cardElement.value) {
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

function onMouseEnter() {
  if (props.secondaryValues && Array.isArray(props.secondaryValues) && props.secondaryValues.length > 0) {
    hovering.value = true;
  }
}

function handleMouseMove(e) {
  if (!cardElement.value) return;
  
  const rect = cardElement.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Normalize to -1 to 1 range
  const normalizedX = -(x - centerX) / centerX;
  const normalizedY = -(y - centerY) / centerY;
  
  // Apply dampening to reduce extreme rotations at edges
  const dampenedX = Math.sign(normalizedX) * Math.pow(Math.abs(normalizedX), 0.7);
  const dampenedY = Math.sign(normalizedY) * Math.pow(Math.abs(normalizedY), 0.7);
  
  const rotateX = dampenedY * -8; // Max 2 degrees tilt
  const rotateY = dampenedX * 6;
  
  // Adjust gradient color stop based on mouse position (reduced range for subtle effect)
  targetGradientStop.value = 65 + (normalizedX * -3) + (normalizedY * 0.5);
  
  // Start animation loop if not already running
  if (!isAnimating.value) {
    isAnimating.value = true;
    animateGradientStop();
  }
  
  cardElement.value.style.transition = 'transform 0.1s ease-out';
  cardElement.value.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function handleMouseLeave() {
  hovering.value = false;
  if (!cardElement.value) return;
  
  // Reset target gradient stop (will animate smoothly via animateGradientStop)
  targetGradientStop.value = 60;
  
  // Start animation loop if not already running
  if (!isAnimating.value) {
    isAnimating.value = true;
    animateGradientStop();
  }
  
  cardElement.value.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  cardElement.value.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
}
</script>

<style scoped>
.progress-circle {
  margin-right: 0.75rem;
}
.progress-circle circle[stroke]:not([stroke="#475569"]) {
  transition: stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1), stroke 1.5s cubic-bezier(0.4,0,0.2,1);
}
.vertical-bar-container {
  height: 100px;
  width: 1.25rem;
  display: flex;
  align-items: flex-end;
  background: rgba(255,255,255,0.05);
  border-radius: 0.25rem 0.25rem 0 0;
}
.vertical-bar {
  width: 100%;
  min-height: 4px;
  border-radius: 0.25rem 0.25rem 0 0;
  background: #2563eb;
  transition: height 0.7s cubic-bezier(0.4,0,0.2,1);
}
.status-element-card {
  transition: box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), padding 0.3s cubic-bezier(0.4,0,0.2,1), max-width 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.2s ease-out;
  transform-style: preserve-3d;
  will-change: transform, background;
}
</style>
