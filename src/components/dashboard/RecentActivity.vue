<template>
  <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color transition-all duration-300 hover:shadow-lg group">
    <div class="px-6 py-4 border-b border-color">
      <h3 class="text-lg font-semibold text-color transition-all duration-200">Display Events</h3>
    </div>
    <div class="p-6 h-[260px] overflow-hidden">
      <TransitionGroup name="activity" tag="div" class="space-y-4">
        <div v-for="(activity, index) in activities" :key="activity.id" class="flex items-start space-x-3 transition-all duration-200 hover:translate-x-1">
          <div :class="getActivityColor(activity.type)" class="p-2 rounded-full transition-transform duration-200 hover:scale-110">
            <component :is="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-color transition-all duration-200">{{ activity.title }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-400 transition-all duration-200">{{ activity.description }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-all duration-200">{{ activity.time }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.activity-enter-active {
  transition: all 0.5s ease;
}

.activity-leave-active {
  transition: all 0.3s ease;
}

.activity-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.activity-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.activity-move {
  transition: transform 0.5s ease;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ExclamationTriangleIcon, CheckCircleIcon, PlayIcon, CubeIcon } from '@heroicons/vue/24/solid';

let activityIdCounter = 0;

const activities = ref([
  {
    id: activityIdCounter++,
    type: 'success',
    title: 'Ad playback started',
    description: 'Campaign: Summer Sale 2026',
    time: '1 minute ago'
  },
  {
    id: activityIdCounter++,
    type: 'container',
    title: 'Container updated',
    description: 'ad-player:latest pulled and restarted',
    time: '10 minutes ago'
  },
  {
    id: activityIdCounter++,
    type: 'playback',
    title: 'Playlist updated',
    description: 'Loaded 12 new advertisements',
    time: '45 minutes ago'
  }
]);

const possibleActivities = [
  {
    type: 'success',
    title: 'Ad playback started',
    description: 'Campaign: Spring Collection 2026',
    time: 'just now'
  },
  {
    type: 'success',
    title: 'Campaign completed',
    description: 'All ads displayed successfully',
    time: 'just now'
  },
  {
    type: 'container',
    title: 'Container health check',
    description: 'All services running normally',
    time: 'just now'
  },
  {
    type: 'playback',
    title: 'New content downloaded',
    description: 'Fetched 8 new video advertisements',
    time: 'just now'
  },
  {
    type: 'playback',
    title: 'Playlist synced',
    description: 'Updated schedule from server',
    time: 'just now'
  },
  {
    type: 'warning',
    title: 'Network latency detected',
    description: 'Response time above 500ms',
    time: 'just now'
  },
  {
    type: 'success',
    title: 'Display calibrated',
    description: 'Screen brightness adjusted',
    time: 'just now'
  },
  {
    type: 'container',
    title: 'Service restarted',
    description: 'Media player service renewed',
    time: 'just now'
  },
  {
    type: 'playback',
    title: 'Queue updated',
    description: 'Added 15 items to playback queue',
    time: 'just now'
  },
  {
    type: 'success',
    title: 'Analytics uploaded',
    description: 'Sent playback statistics to server',
    time: 'just now'
  }
];

let activityInterval = null;

const addNewActivity = () => {
  const randomActivity = possibleActivities[Math.floor(Math.random() * possibleActivities.length)];
  activities.value.unshift({ ...randomActivity, id: activityIdCounter++ });
  
  // Keep only the last 3 activities
  if (activities.value.length > 3) {
    activities.value.pop();
  }
};

onMounted(() => {
  // Add a new activity every 5-10 seconds
  activityInterval = setInterval(() => {
    addNewActivity();
  }, Math.random() * 5000 + 5000); // Random between 5-10 seconds
});

onUnmounted(() => {
  if (activityInterval) {
    clearInterval(activityInterval);
  }
});

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
