<template>
  <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color transition-all duration-300 hover:shadow-lg">
    <div class="px-6 py-4 border-b border-color">
      <h3 class="text-lg font-semibold text-color">Ad Playback Queue</h3>
    </div>
    
    <div class="px-6 py-4 space-y-5 h-[260px] overflow-hidden">
      <!-- Current Ad Playing -->
      <div class="relative">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Now Playing</span>
          <span class="text-xs font-mono text-color">{{ formatTime(currentAd.timeLeft) }}</span>
        </div>
        
        <div class="bg-gradient-to-r from-purple-900/20 to-white-900/20 rounded-xl p-4 border border-purple-500/30 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent animate-pulse"></div>
          <div class="relative z-10">
            <div class="flex items-center space-x-3">
              <div class="p-3 bg-purple-500 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-bold text-color">{{ currentAd.company }}</h4>
                <p class="text-sm text-gray-400">{{ currentAd.title }}</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-purple-400">{{ Math.round(((currentAd.duration - currentAd.timeLeft) / currentAd.duration) * 100) }}%</div>
                <div class="text-xs text-gray-400">Complete</div>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-linear"
                :style="{ width: `${100 - (currentAd.timeLeft / currentAd.duration) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Up Next Queue -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Up Next</span>
          <span class="text-xs text-gray-500">Ads in queue</span>
        </div>
        
        <div class="space-y-3 ">
          <TransitionGroup name="queue" tag="div" class="space-y-3">
            <div 
              v-for="(ad, index) in upcomingAds" 
              :key="ad.id"
              class="flex items-center space-x-3 p-2 rounded-lg transition-all duration-200"
            >
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <h5 class="text-sm font-semibold text-color truncate">{{ ad.company }}</h5>
                <p class="text-xs text-gray-400 truncate">{{ ad.title }}</p>
              </div>
              <div class="flex-shrink-0 text-right">
                <div class="text-xs font-mono text-gray-400">{{ formatTime(ad.duration) }}</div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

let adIdCounter = 0;

const currentAd = ref({
  id: adIdCounter++,
  company: 'TechCorp Solutions',
  title: 'Summer Sale 2026 Campaign',
  duration: 80,
  timeLeft: 50
});

const upcomingAds = ref([
  {
    id: adIdCounter++,
    company: 'GreenLeaf Organics',
    title: 'New Product Launch',
    duration: 95
  }
]);

const allAds = [
  { company: 'TechCorp Solutions', title: 'Summer Sale 2026 Campaign', duration: 80 },
  { company: 'GreenLeaf Organics', title: 'New Product Launch', duration: 95 },
  { company: 'AutoDrive Motors', title: 'Electric Vehicle Showcase', duration: 44 },
  { company: 'FreshMart Groceries', title: 'Weekly Deals', duration: 143 },
  { company: 'SportGear Pro', title: 'Fitness Equipment Sale', duration: 38 },
  { company: 'CloudSync Tech', title: 'Cloud Storage Solutions', duration: 42 },
  { company: 'PetPal Store', title: 'Pet Supplies Discount', duration: 64 },
  { company: 'HomeStyle Furniture', title: 'Living Room Collection', duration: 45 },
  { company: 'HealthPlus Pharmacy', title: 'Wellness Programs', duration: 56 },
  { company: 'TravelWise Agency', title: 'Vacation Packages', duration: 32 }
];

let countdownInterval = null;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const moveToNextAd = () => {
  // Move current ad to end of cycle
  const finishedAd = currentAd.value;
  
  // Get next ad from queue
  if (upcomingAds.value.length > 0) {
    currentAd.value = {
      ...upcomingAds.value[0],
      timeLeft: upcomingAds.value[0].duration
    };
    
    // Remove from upcoming
    upcomingAds.value.shift();
    
    // Add a new random ad to the end of queue if queue is getting short
    if (upcomingAds.value.length < 3) {
      const randomAd = allAds[Math.floor(Math.random() * allAds.length)];
      upcomingAds.value.push({
        id: adIdCounter++,
        ...randomAd
      });
    }
  }
};

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    if (currentAd.value.timeLeft > 0) {
      currentAd.value.timeLeft--;
    } else {
      moveToNextAd();
    }
  }, 1000);
};

onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
.queue-enter-active {
  transition: all 0.4s ease;
}

.queue-leave-active {
  transition: all 0.3s ease;
}

.queue-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.queue-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.queue-move {
  transition: transform 0.4s ease;
}
</style>
