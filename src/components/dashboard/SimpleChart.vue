<template>
  <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg group">
    <h3 class="text-lg font-semibold text-color mb-4 transition-all duration-200">{{ title }}</h3>
    <div class="relative h-64">
      <svg class="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
        <!-- Grid lines -->
        <line v-for="i in 5" :key="`h-${i}`" 
          :x1="0" :y1="i * 40" :x2="500" :y2="i * 40" 
          stroke="currentColor" class="text-gray-600 dark:text-gray-600" stroke-width="1" opacity="0.2"/>
        
        <!-- Area fill -->
        <path :d="areaPath" :fill="areaFill" opacity="0.2"/>
        
        <!-- Line -->
        <path :d="linePath" :stroke="lineColor" stroke-width="3" fill="none" stroke-linecap="round" class="transition-all duration-300"/>
        
        <!-- Points -->
        <circle v-for="(point, index) in points" :key="index"
          :cx="point.x" :cy="point.y" r="4" 
          :fill="lineColor" class="opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"/>
      </svg>
      
      <!-- Labels -->
      <div class="flex justify-between mt-2 text-xs text-gray-400 dark:text-gray-400">
        <span v-for="label in labels" :key="label" class="transition-all duration-200">{{ label }}</span>
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

const lineColor = computed(() => props.color);
const areaFill = computed(() => props.color);

const maxValue = computed(() => Math.max(...props.data));
const minValue = computed(() => Math.min(...props.data));

const points = computed(() => {
  const width = 500;
  const height = 200;
  const padding = 20;
  const segmentWidth = (width - 2 * padding) / (props.data.length - 1);
  
  return props.data.map((value, index) => {
    const x = padding + index * segmentWidth;
    const normalizedValue = (value - minValue.value) / (maxValue.value - minValue.value || 1);
    const y = height - padding - (normalizedValue * (height - 2 * padding));
    return { x, y, value };
  });
});

const linePath = computed(() => {
  if (points.value.length === 0) return '';
  return points.value.reduce((path, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
  }, '');
});

const areaPath = computed(() => {
  if (points.value.length === 0) return '';
  const firstPoint = points.value[0];
  const lastPoint = points.value[points.value.length - 1];
  return `${linePath.value} L ${lastPoint.x} 180 L ${firstPoint.x} 180 Z`;
});
</script>
