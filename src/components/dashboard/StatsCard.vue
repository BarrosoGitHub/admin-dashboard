<template>
  <div class="bg-modal-color-gradient rounded-2xl shadow-sm p-6 border border-color hover:shadow-lg transition-all duration-300 group">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-400 dark:text-gray-400 transition-all duration-200">{{ title }}</p>
        <p class="text-2xl font-bold text-color mt-2 transition-all duration-200">{{ value }}</p>
        <div class="flex items-center mt-2" v-if="change">
          <span :class="changeClass" class="text-sm font-medium flex items-center transition-all duration-200">
            <svg v-if="changeType === 'up'" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            {{ change }}
          </span>
        </div>
      </div>
      <div :class="iconBgClass" class="p-3 rounded-full transition-transform duration-200 group-hover:scale-110">
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
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
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
});

const iconBgClass = computed(() => {
  switch (props.iconType) {
    case 'display': return 'bg-blue-500';
    case 'impressions': return 'bg-green-500';
    case 'ads': return 'bg-purple-500';
    case 'containers': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
});
</script>
