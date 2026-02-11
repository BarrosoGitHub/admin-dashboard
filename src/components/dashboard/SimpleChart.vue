<template>
  <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg group">
    <h3 class="text-lg font-semibold text-color mb-4 transition-all duration-200">{{ title }}</h3>
    <div class="relative h-64">
      <svg class="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
        <!-- Grid lines -->
        <line v-for="i in 5" :key="`h-${i}`" 
          :x1="40" :y1="i * 40" :x2="500" :y2="i * 40" 
          stroke="currentColor" class="text-gray-600 dark:text-gray-600" stroke-width="1" opacity="0.2"/>
        
        <!-- Bar chart -->
        <g v-for="(bar, index) in bars" :key="index">
          <rect 
            :x="bar.x" 
            :y="bar.y" 
            :width="bar.width" 
            :height="bar.height"
            :fill="barColor"
            class="transition-all duration-300 hover:opacity-80 cursor-pointer"
            opacity="0.7"
            rx="4"
          />
          <!-- Value label on top of bar -->
          <text 
            :x="bar.x + bar.width / 2" 
            :y="bar.y - 5"
            text-anchor="middle"
            class="text-xs fill-gray-400 dark:fill-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            font-size="12"
          >{{ bar.value }}</text>
        </g>
      </svg>
      
      <!-- Labels -->
      <div class="relative mt-2 text-xs text-gray-400 dark:text-gray-400" style="height: 20px;">
        <span 
          v-for="(label, index) in labels" 
          :key="label" 
          class="absolute transition-all duration-200"
          :style="{ left: `${(bars[index].x + bars[index].width / 2) / 5}%`, transform: 'translateX(-50%)' }"
        >{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Ad Impressions'
  },
  data: {
    type: Array,
    default: () => [30, 45, 40, 60, 55, 70, 65]
  },
  labels: {
    type: Array,
    default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  color: {
    type: String,
    default: '#3B82F6'
  }
});

const barColor = computed(() => props.color);

const maxValue = computed(() => Math.max(...props.data));
const minValue = computed(() => Math.min(...props.data));

const bars = computed(() => {
  const width = 500;
  const height = 200;
  const padding = 40;
  const bottomPadding = 20;
  const barSpacing = 8;
  const barWidth = (width - 2 * padding - (props.data.length - 1) * barSpacing) / props.data.length;
  
  return props.data.map((value, index) => {
    const x = padding + index * (barWidth + barSpacing);
    const normalizedValue = (value - minValue.value) / (maxValue.value - minValue.value || 1);
    const barHeight = normalizedValue * (height - padding - bottomPadding);
    const y = height - bottomPadding - barHeight;
    return { 
      x, 
      y, 
      width: barWidth, 
      height: barHeight,
      value 
    };
  });
});
</script>
