<template>
  <div :class="[
    'bg-modal-color-gradient rounded-2xl shadow-sm p-6 border transition-all duration-300 group relative overflow-hidden',
    selected ? 'border-gray-500 shadow-lg shadow-gray-500/20 ring-1 ring-gray-500/30' : 'border-color hover:shadow-lg hover:border-gray-500/30'
  ]">
    <!-- Background gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div class="flex items-center justify-between relative z-10">
      <div class="flex-1">
        <p class="text-xs font-medium text-gray-400 dark:text-gray-500 transition-all duration-200 uppercase tracking-wider">{{ title }}</p>
        <p class="text-3xl font-bold text-color mt-3 mb-2 transition-all duration-200">{{ displayValue }}</p>
        <div class="flex items-center mt-2" v-if="change">
          <span :class="changeClass" class="text-xs font-semibold flex items-center transition-all duration-200">
            <svg v-if="changeType === 'up'" class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            {{ change }}
          </span>
        </div>
      </div>
      
      <!-- Circular Progress Indicator -->
      <div class="relative flex items-center justify-center">
        <svg class="transform -rotate-90" width="80" height="80" viewBox="0 0 80 80">
          <!-- Background circle -->
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="currentColor"
            :class="[selected ? 'text-gray-500/20' : 'text-gray-700 dark:text-gray-800']"
            stroke-width="6"
            fill="none"
          />
          <!-- Progress circle -->
          <circle
            cx="40"
            cy="40"
            r="32"
            :stroke="progressColor"
            stroke-width="6"
            fill="none"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
            class="transition-all duration-1000 ease-out"
          />
        </svg>
        
        <!-- Icon in center -->
        <div :class="iconBgClass" class="absolute p-3 rounded-full transition-all duration-200 group-hover:scale-110">
          <component :is="icon" class="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { 
  TvIcon,
  EyeIcon,
  PlayIcon,
  CubeIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  title: String,
  value: [String, Number],
  change: String,
  changeType: {
    type: String,
    default: 'up'
  },
  iconType: {
    type: String,
    default: 'display'
  },
  selected: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 75
  }
});

const animatedValue = ref(0);
const animatedProgress = ref(0);

const displayValue = computed(() => {
  // If value is a number, show animated counter
  if (typeof props.value === 'number') {
    return Math.round(animatedValue.value);
  }
  // If value contains a number (like "12.4K"), animate the numeric part
  if (typeof props.value === 'string' && /\d/.test(props.value)) {
    const match = props.value.match(/([\d.]+)/);
    if (match) {
      const num = parseFloat(match[1]);
      const suffix = props.value.replace(match[0], '');
      return (animatedValue.value || num).toFixed(1) + suffix;
    }
  }
  return props.value;
});

// Circular progress calculations
const circumference = 2 * Math.PI * 32; // r=32
const progressOffset = computed(() => {
  const progress = animatedProgress.value;
  return circumference - (progress / 100) * circumference;
});

const progressColor = computed(() => {
  switch (props.iconType) {
    case 'display': return '#6B7280'; // gray-500
    case 'impressions': return '#9CA3AF'; // gray-400
    case 'ads': return '#4B5563'; // gray-600
    case 'containers': return '#6B7280'; // gray-500
    default: return '#6B7280';
  }
});

function animateValue(start, end, duration = 1500) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    
    animatedValue.value = start + (end - start) * easeOutQuart;
    animatedProgress.value = props.progress * easeOutQuart;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      animatedValue.value = end;
      animatedProgress.value = props.progress;
    }
  }
  
  requestAnimationFrame(update);
}

onMounted(() => {
  // Extract numeric value for animation
  let targetValue = 0;
  if (typeof props.value === 'number') {
    targetValue = props.value;
  } else if (typeof props.value === 'string') {
    const match = props.value.match(/([\d.]+)/);
    if (match) {
      targetValue = parseFloat(match[1]);
    }
  }
  
  if (targetValue > 0) {
    animateValue(0, targetValue);
  }
});

watch(() => props.value, (newValue, oldValue) => {
  let newNum = 0;
  let oldNum = 0;
  
  if (typeof newValue === 'number') {
    newNum = newValue;
  } else if (typeof newValue === 'string') {
    const match = newValue.match(/([\d.]+)/);
    if (match) newNum = parseFloat(match[1]);
  }
  
  if (typeof oldValue === 'number') {
    oldNum = oldValue;
  } else if (typeof oldValue === 'string') {
    const match = oldValue.match(/([\d.]+)/);
    if (match) oldNum = parseFloat(match[1]);
  }
  
  if (newNum !== oldNum && newNum > 0) {
    animateValue(oldNum, newNum, 800);
  }
});

const icon = computed(() => {
  switch (props.iconType) {
    case 'display': return TvIcon;
    case 'impressions': return EyeIcon;
    case 'ads': return PlayIcon;
    case 'containers': return CubeIcon;
    default: return TvIcon;
  }
});

const changeClass = computed(() => {
  return props.changeType === 'up' 
    ? 'text-gray-400 dark:text-gray-300' 
    : 'text-gray-500 dark:text-gray-400';
});

const iconBgClass = computed(() => {
  switch (props.iconType) {
    case 'display': return 'bg-gray-600';
    case 'impressions': return 'bg-gray-500';
    case 'ads': return 'bg-gray-700';
    case 'containers': return 'bg-gray-600';
    default: return 'bg-gray-500';
  }
});
</script>
