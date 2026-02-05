<template>
  <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color transition-all duration-300 hover:shadow-lg group">
    <div class="p-6 border-b border-color">
      <h3 class="text-lg font-semibold text-color transition-all duration-200">Display Events</h3>
    </div>
    <div class="p-6">
      <div class="space-y-4">
        <div v-for="(activity, index) in activities" :key="index" class="flex items-start space-x-3 transition-all duration-200 hover:translate-x-1">
          <div :class="getActivityColor(activity.type)" class="p-2 rounded-full transition-transform duration-200 hover:scale-110">
            <component :is="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-color transition-all duration-200">{{ activity.title }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-400 transition-all duration-200">{{ activity.description }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-all duration-200">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ExclamationTriangleIcon, CheckCircleIcon, PlayIcon, CubeIcon } from '@heroicons/vue/24/solid';

const activities = ref([
  {
    type: 'success',
    title: 'Ad playback started',
    description: 'Campaign: Summer Sale 2026',
    time: '1 minute ago'
  },
  {
    type: 'container',
    title: 'Container updated',
    description: 'ad-player:latest pulled and restarted',
    time: '10 minutes ago'
  },
  {
    type: 'playback',
    title: 'Playlist updated',
    description: 'Loaded 12 new advertisements',
    time: '45 minutes ago'
  },
  {
    type: 'warning',
    title: 'Storage warning',
    description: 'Cache directory at 85% capacity',
    time: '2 hours ago'
  }
]);

const getActivityIcon = (type) => {
  switch (type) {
    case 'warning': return ExclamationTriangleIcon;
    case 'success': return CheckCircleIcon;
    case 'playback': return PlayIcon;
    case 'container': return CubeIcon;
    default: return CheckCircleIcon;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'warning': return 'bg-yellow-500';
    case 'success': return 'bg-green-500';
    case 'playback': return 'bg-purple-500';
    case 'container': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};
</script>
