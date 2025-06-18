<template>
  <div class="status-element-card p-4 my-5 rounded-2xl shadow-inner bg-modal-color border border-color flex items-center justify-between shadow-md">
    <div class="flex items-center pr-50">
      <component :is="iconComponent" class="w-7 h-7 text-white opacity-80 mr-3" />
      <span class="text-lg text-white font-semibold">{{ title }}</span>
    </div>
    <div class="ml-4 flex items-center">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="progress-circle">
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
          fill="white"
          font-size="18"
          font-family="monospace"
        >{{ valueDisplay }}</text>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  TagIcon,
  ClockIcon,
  CpuChipIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  Bars3BottomLeftIcon,
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
  }
});
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
</script>

<style scoped>
.progress-circle {
  display: block;
}
.progress-circle circle[stroke]:not([stroke="#475569"]) {
  transition: stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1), stroke 1.5s cubic-bezier(0.4,0,0.2,1);
}
</style>
