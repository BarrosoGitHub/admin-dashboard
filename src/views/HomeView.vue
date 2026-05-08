<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import Navbar from "../components/navbar/Navbar.vue";
import ConfirmationToast from "../components/toasts/ConfirmationToast.vue";
import PasswordChangeModal from "../components/Modals/PasswordChangeModal.vue";
import AppInfoCard from "../components/tabs/AppInfoCard.vue";
import StatusElementCard from "../components/tabs/StatusElementCard.vue";
import PortfolioCard from "../components/tabs/PortfolioCard.vue";
import ProfileCard from "../components/tabs/ProfileCard.vue";
import NecroBrawlShowcase from "../components/tabs/NecroBrawlShowcase.vue";
import StatsCard from "../components/dashboard/StatsCard.vue";
import SimpleChart from "../components/dashboard/SimpleChart.vue";
import RecentActivity from "../components/dashboard/RecentActivity.vue";
import CurrentAdCard from "../components/dashboard/CurrentAdCard.vue";
import { API_BASE_URL, WS_BASE_URL } from '@/apiConfig.js';
import axios from 'axios';
const diagnostics = ref({
  cpuTemp: 0,
  ramUsage: 0,
  diskSpace: 0,
  cpuTemps: [],
  ramUsages: []
});

const animatedDiagnostics = ref({
  cpuTemp: 45,
  ramUsage: 66,
  diskSpace: 23
});

function animateDiagnosticValue(key, start, end, duration = 800) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    
    animatedDiagnostics.value[key] = start + (end - start) * easeOutQuart;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      animatedDiagnostics.value[key] = end;
    }
  }
  
  requestAnimationFrame(update);
}

// Computed properties for better performance
const hasAppInfoData = computed(() => Array.isArray(appInfoData.value) && appInfoData.value.length > 0);
const hasFilteredAppInfoData = computed(() => filteredAppInfoData.value && filteredAppInfoData.value.length);
const filteredAppInfoData = computed(() => {
  if (!Array.isArray(appInfoData.value) || !searchValue.value.trim() || activeModal.value !== 'appInfo') {
    return Array.isArray(appInfoData.value) ? appInfoData.value : [];
  }
  
  const search = searchValue.value.toLowerCase();
  return appInfoData.value.filter(info => 
    info?.Id?.toLowerCase().includes(search) ||
    info?.Status?.toLowerCase().includes(search) ||
    info?.Hash?.toLowerCase().includes(search) ||
    info?.Version?.toLowerCase().includes(search) ||
    info?.StartUpTime?.toLowerCase().includes(search)
  );
});
const sidebarClasses = computed(() => ['flex flex-col', sidebarOpen.value ? 'md:ml-64' : '']);
const maxRamValue = computed(() => {
  if (!Array.isArray(diagnostics.value.ramUsages)) return 100;
  const totalEntry = diagnostics.value.ramUsages.find(e => e.toLowerCase().startsWith('total'));
  if (!totalEntry) return 100;
  return Number(totalEntry.split(':')[1]?.replace('Mb','').trim()) || 100;
});

let ws = null;

// --- Modal state management ---
const activeModal = ref(null);
const showAppInfoCard = ref(false);
const showPasswordChangeModal = ref(false);
const showPortfolio = ref(true);
const showProfile = ref(false);
const selectedProject = ref(null);
const showProjectDetails = ref(false);
const infoBtnSeen = ref(false);

// --- Data refs ---
const appInfoData = ref([]);
const showDashboard = ref(false);
const dashboardStats = ref({
  displayStatus: 'Active',
  impressions: '12.4K',
  adsPlayed: 342,
  containers: 5
});

const selectedMetric = ref('impressions');
const metricsData = ref({
  impressions: {
    data: [1240, 1580, 1420, 1890, 1650, 2100, 1950],
    title: 'Impressions (Last 7 Days)',
    color: '#10B981'
  },
  adsPlayed: {
    data: [298, 315, 287, 356, 342, 389, 367],
    title: 'Ads Played (Last 7 Days)',
    color: '#8B5CF6'
  },
  displayStatus: {
    data: [24, 24, 24, 24, 24, 24, 24],
    title: 'Uptime Hours (Last 7 Days)',
    color: '#3B82F6'
  },
  containers: {
    data: [5, 5, 5, 4, 5, 5, 5],
    title: 'Active Containers (Last 7 Days)',
    color: '#F59E0B'
  }
});

const chartData = computed(() => metricsData.value[selectedMetric.value].data);
const chartTitle = computed(() => metricsData.value[selectedMetric.value].title);
const chartColor = computed(() => metricsData.value[selectedMetric.value].color);

function selectMetric(metric) {
  selectedMetric.value = metric;
}

// --- Component refs ---
const sidebarOpen = ref(false);
const toastRef = ref(null);

// --- Search functionality ---
const searchValue = ref("");
const activeCardName = computed(() => {
  if (selectedProject.value && showProjectDetails.value) {
    return 'Project Details';
  }
  switch (activeModal.value) {
    case 'appInfo': return 'App Information';
    case 'portfolio': return 'Portfolio';
    case 'profile': return 'Profile';
    default: return 'Portfolio';
  }
});

const showSearchForActiveCard = computed(() => {
  // Only show search for cards that have searchable content
  return activeModal.value === 'appInfo';
});

function handleSearchUpdate(value) {
  searchValue.value = value;
}

// Clear search when modal changes
watch(activeModal, (newModal, oldModal) => {
  if (newModal !== oldModal) {
    searchValue.value = "";
  }
});

function handlePortfolio() {
  activeModal.value = "portfolio";
  showProjectDetails.value = false;
  selectedProject.value = null;
  showAppInfoCard.value = false;
  showPortfolio.value = true;
  showProfile.value = false;
}

function handleProfile() {
  activeModal.value = "profile";
  showProjectDetails.value = false;
  selectedProject.value = null;
  showAppInfoCard.value = false;
  showPortfolio.value = false;
  showProfile.value = true;
}

function handleProjectSelected(projectId) {
  selectedProject.value = projectId;
  showProjectDetails.value = true;
  showPortfolio.value = false;
  
  // Only fetch app info data for projects that need it (not project 5)
  if (projectId !== 5) {
    axios.get(`${API_BASE_URL}/info/services`)
      .then(response => {
        appInfoData.value = Array.isArray(response.data) ? response.data : [response.data];
      })
      .catch(error => {
        appInfoData.value = [];
      });
  }
}

function resetAllModals() {
  activeModal.value = null;
  showAppInfoCard.value = false;
  showDashboard.value = false;
  showPasswordChangeModal.value = false;
  showPortfolio.value = true;
  showProfile.value = false;
  selectedProject.value = null;
  showProjectDetails.value = false;
  appInfoData.value = [];
}

function handlePasswordChange() {
  showPasswordChangeModal.value = true;
}

function handlePasswordChangeSuccess() {
  toastRef.value?.showConfirmationToast("Password changed successfully!", true);
}

function handleNavigateToProfile() {
  showProfile.value = true;
  showPortfolio.value = false;
  showProjectDetails.value = false;
  showDashboard.value = false;
}

function handleNavigateToPortfolio() {
  showProfile.value = false;
  showPortfolio.value = true;
  showProjectDetails.value = false;
  showDashboard.value = false;
}

// Listen for logout event (dispatched from Avatar.vue)
window.addEventListener("sidebar-close", resetAllModals);

onMounted(() => {
  setTimeout(() => {
    sidebarOpen.value = true;
  }, 150);

  initializeWebSocket();
});

// --- WebSocket management ---
function initializeWebSocket() {
  ws = new WebSocket(`${WS_BASE_URL}/ws/stats`);
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      updateDiagnostics(data);
    } catch (e) {
      // Reset diagnostics on error
      diagnostics.value = {
        cpuTemp: 0,
        ramUsage: 0,
        diskSpace: 0,
        cpuTemps: [],
        ramUsages: []
      };
    }
  };
  ws.onerror = () => { /* Handle error if needed */ };
  ws.onclose = () => { /* Handle close if needed */ };
}

function updateDiagnostics(data) {
  // CPU Temperature processing
  if (data.cpuTemperatures && typeof data.cpuTemperatures === 'object') {
    let cpu0 = null, cpu1 = null;
    
    for (const [key, value] of Object.entries(data.cpuTemperatures)) {
      if (key.startsWith('cpu0')) cpu0 = value;
      if (key.startsWith('cpu1')) cpu1 = value;
    }
    
    let cpuAverage = 0;
    if (cpu0 !== null && cpu1 !== null) {
      cpuAverage = (cpu0 + cpu1) / 2;
    } else if (cpu0 !== null) {
      cpuAverage = cpu0;
    } else if (cpu1 !== null) {
      cpuAverage = cpu1;
    }
    
    const newCpuTemp = Math.round(cpuAverage);
    if (newCpuTemp !== diagnostics.value.cpuTemp) {
      animateDiagnosticValue('cpuTemp', animatedDiagnostics.value.cpuTemp, newCpuTemp);
    }
    diagnostics.value.cpuTemp = newCpuTemp;
    diagnostics.value.cpuTemps = Object.entries(data.cpuTemperatures)
      .map(([key, value]) => `${key}: ${value}°C`);
  } else {
    diagnostics.value.cpuTemp = 0;
    animatedDiagnostics.value.cpuTemp = 0;
    diagnostics.value.cpuTemps = [];
  }
  
  // RAM Usage processing
  if (data.ramUsage?.total && data.ramUsage?.load) {
    const newRamUsage = Math.round((data.ramUsage.load / data.ramUsage.total) * 100);
    if (newRamUsage !== diagnostics.value.ramUsage) {
      animateDiagnosticValue('ramUsage', animatedDiagnostics.value.ramUsage, newRamUsage);
    }
    diagnostics.value.ramUsage = newRamUsage;
    diagnostics.value.ramUsages = Object.entries(data.ramUsage)
      .map(([key, value]) => `${key}: ${value} Mb`);
  } else {
    diagnostics.value.ramUsage = 0;
    animatedDiagnostics.value.ramUsage = 0;
    diagnostics.value.ramUsages = [];
  }
  
  // Disk Space processing
  if (Array.isArray(data.diskSpace) && data.diskSpace.length > 0) {
    const root = data.diskSpace.find(d => d.mount === "/") || data.diskSpace[0];
    const newDiskSpace = root?.percentUsed ? Math.round(root.percentUsed) : 0;
    if (newDiskSpace !== diagnostics.value.diskSpace) {
      animateDiagnosticValue('diskSpace', animatedDiagnostics.value.diskSpace, newDiskSpace);
    }
    diagnostics.value.diskSpace = newDiskSpace;
  } else {
    diagnostics.value.diskSpace = 0;
    animatedDiagnostics.value.diskSpace = 0;
  }
}

onBeforeUnmount(() => {
  if (ws) {
    ws.close();
    ws = null;
  }
});
</script>

<template>
  <!-- Main Content -->
  <div class="bg-website-color-gradient min-h-screen min-w-screen relative">
  
    <!-- Background SVG - Fixed at bottom, behind content but above background -->
    <div class="custom-shape-divider-bottom-1750243590">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
      </svg>
    </div>
  
    <Sidebar
      :show="sidebarOpen"
      @sidebar-toggle="sidebarOpen = $event"
      @password-change="handlePasswordChange"
      @portfolio="handlePortfolio"
      @profile="handleProfile"
      @project-selected="handleProjectSelected"
    />
    
    <div :class="sidebarClasses">
      <!-- Main content and left cards -->

      <div class="flex-1 md:flex-row">
        <div class="flex-1">
          <Navbar 
            @sidebar-toggle="sidebarOpen = !sidebarOpen" 
            @password-change="handlePasswordChange"
            @search-update="handleSearchUpdate"
            @navigate-to-profile="handleNavigateToProfile"
            @navigate-to-portfolio="handleNavigateToPortfolio"
            :searchValue="searchValue"
            :showSearch="showSearchForActiveCard"
            :activeCard="activeCardName"
            :sidebarOpen="sidebarOpen"
          />

          <div class="flex flex-col md:flex-row md:space-x-4 pt-24">
          
            <div class="flex-1 px-4">
              <PasswordChangeModal
                :show="showPasswordChangeModal"
                @close="showPasswordChangeModal = false"
                @success="handlePasswordChangeSuccess"
              />
              <transition :key="activeModal" mode="out-in">
                <template v-if="showProjectDetails && selectedProject === 5">
                  <NecroBrawlShowcase @back="handlePortfolio" />
                </template>
                <template v-else-if="showProjectDetails && selectedProject">
                  <div class="p-6 space-y-6">
                    <div class="flex items-center justify-between mb-6">
                      <div>
                        <h2 class="text-3xl font-bold text-color">Ad Display Device</h2>
                        <p class="text-gray-400 dark:text-gray-400 mt-2">Containerized digital signage platform</p>
                      </div>
                      <div class="flex items-center gap-3">
                        <!-- Info button -->
                        <div class="relative group">
                          <button
                            :class="['w-8 h-8 rounded-full border bg-modal-color-gradient text-sm font-bold flex items-center justify-center transition-all duration-200', infoBtnSeen ? 'border-color text-color hover:border-purple-400 hover:text-purple-300 hover:shadow-lg' : 'info-btn border-purple-500/60 text-purple-300 hover:border-purple-400 hover:shadow-[0_0_12px_2px_rgba(168,85,247,0.45)]']"
                            @mouseenter="infoBtnSeen = true"
                            @click="infoBtnSeen = true"
                          >
                            ?
                          </button>
                          <!-- ping ring -->
                          <span v-if="!infoBtnSeen" class="absolute inset-0 rounded-full border border-purple-400/60 animate-ping pointer-events-none"></span>
                          <!-- Tooltip -->
                          <div class="absolute right-0 top-10 z-50 w-80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div class="bg-gray-900 border border-gray-600/60 rounded-xl shadow-2xl p-4 text-left">
                              <div class="flex items-center gap-2 mb-3">
                                <div class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                                <span class="text-xs font-bold text-purple-300 uppercase tracking-widest">Simulated Environment</span>
                              </div>
                              <p class="text-sm text-gray-200 font-semibold mb-2">Ad Display Embedded System</p>
                              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                                This dashboard simulates the management interface of a real-world <span class="text-purple-300 font-medium">ad display board</span> built on a <span class="text-blue-300 font-medium">Toradex Apalis</span> — a production-grade ARM64 system-on-module (SOM).
                              </p>
                              <div class="space-y-2 border-t border-gray-700/60 pt-3">
                                <div class="flex items-start gap-2">
                                  <span class="text-purple-400 text-xs mt-0.5">▸</span>
                                  <p class="text-xs text-gray-400"><span class="text-gray-200 font-medium">Docker microservices</span> — each concern (ad scheduler, renderer, telemetry, network watchdog) runs in its own isolated container on the ARM64 host.</p>
                                </div>
                                <div class="flex items-start gap-2">
                                  <span class="text-purple-400 text-xs mt-0.5">▸</span>
                                  <p class="text-xs text-gray-400"><span class="text-gray-200 font-medium">Ad playback engine</span> — a lightweight Chromium-based kiosk renderer consumes a playlist API and plays scheduled media full-screen.</p>
                                </div>
                                <div class="flex items-start gap-2">
                                  <span class="text-purple-400 text-xs mt-0.5">▸</span>
                                  <p class="text-xs text-gray-400"><span class="text-gray-200 font-medium">Remote management</span> — this web dashboard communicates with a REST/WebSocket gateway container to push content updates, retrieve health metrics, and reboot services without physical access.</p>
                                </div>
                                <div class="flex items-start gap-2">
                                  <span class="text-purple-400 text-xs mt-0.5">▸</span>
                                  <p class="text-xs text-gray-400"><span class="text-gray-200 font-medium">OTA updates</span> — container images are pulled from a private registry over a secured channel, enabling zero-downtime deployments in the field.</p>
                                </div>
                                <div class="flex items-start gap-2">
                                  <span class="text-purple-400 text-xs mt-0.5">▸</span>
                                  <p class="text-xs text-gray-400"><span class="text-gray-200 font-medium">Telemetry & uptime</span> — the device streams CPU temperature, memory usage, and display heartbeats to this dashboard in real time.</p>
                                </div>
                              </div>
                              <div class="mt-3 pt-3 border-t border-gray-700/60 flex items-center gap-2">
                                <span class="text-xs text-gray-500 italic">All data shown is simulated for portfolio demonstration purposes.</span>
                              </div>
                            </div>
                            <!-- Arrow -->
                            <div class="absolute -top-1.5 right-3 w-3 h-3 bg-gray-900 border-l border-t border-gray-600/60 rotate-45"></div>
                          </div>
                        </div>
                        <button 
                          @click="handlePortfolio"
                          class="px-4 py-2 bg-modal-color-gradient border border-color rounded-lg text-color hover:shadow-lg transition-all duration-200"
                        >
                          ← Back to Projects
                        </button>
                      </div>
                    </div>

                    <!-- Stats Cards Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div @click="selectMetric('displayStatus')" class="cursor-pointer transform transition-all duration-200 hover:scale-105">
                        <StatsCard 
                          title="Display Status" 
                          :value="dashboardStats.displayStatus"
                          change="24/7"
                          changeType="up"
                          iconType="display"
                          :selected="selectedMetric === 'displayStatus'"
                          :progress="100"
                        />
                      </div>
                      <div @click="selectMetric('impressions')" class="cursor-pointer transform transition-all duration-200 hover:scale-105">
                        <StatsCard 
                          title="Impressions" 
                          :value="dashboardStats.impressions"
                          change="+18%"
                          changeType="up"
                          iconType="impressions"
                          :selected="selectedMetric === 'impressions'"
                          :progress="85"
                        />
                      </div>
                      <div @click="selectMetric('adsPlayed')" class="cursor-pointer transform transition-all duration-200 hover:scale-105">
                        <StatsCard 
                          title="Ads Played Today" 
                          :value="dashboardStats.adsPlayed"
                          change="+23"
                          changeType="up"
                          iconType="ads"
                          :selected="selectedMetric === 'adsPlayed'"
                          :progress="92"
                        />
                      </div>
                      <div @click="selectMetric('containers')" class="cursor-pointer transform transition-all duration-200 hover:scale-105">
                        <StatsCard 
                          title="Active Containers" 
                          :value="dashboardStats.containers"
                          change="Healthy"
                          changeType="up"
                          iconType="containers"
                          :selected="selectedMetric === 'containers'"
                          :progress="100"
                        />
                      </div>
                    </div>

                    <!-- Charts and Activity Row -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div class="lg:col-span-1">
                        <SimpleChart 
                          :title="chartTitle" 
                          :data="chartData"
                          :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
                          :color="chartColor"
                        />
                      </div>
                      <div class="lg:col-span-1">
                        <RecentActivity />
                      </div>
                      <div class="lg:col-span-1">
                        <CurrentAdCard />
                      </div>
                    </div>

                    <!-- System Health -->
                    <div>
                      <div class="flex items-center gap-3 mb-4">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">System Health</span>
                        <div class="flex-1 h-px bg-gray-700/50"></div>
                        <div class="flex items-center gap-1.5">
                          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                          <span class="text-xs text-green-400 font-medium">Nominal</span>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        <!-- CPU Temp -->
                        <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-5 transition-all duration-300 hover:shadow-lg group">
                          <div class="flex items-center justify-between mb-3">
                            <p class="text-sm text-gray-400">CPU Temp</p>
                            <div :class="['p-2 rounded-lg transition-transform duration-200 group-hover:scale-110', animatedDiagnostics.cpuTemp >= 75 ? 'bg-red-500/20' : animatedDiagnostics.cpuTemp >= 60 ? 'bg-orange-500/20' : 'bg-emerald-500/20']">
                              <svg :class="['w-5 h-5', animatedDiagnostics.cpuTemp >= 75 ? 'text-red-400' : animatedDiagnostics.cpuTemp >= 60 ? 'text-orange-400' : 'text-emerald-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6a2 2 0 012-2h2a2 2 0 012 2v13m-6 0a3 3 0 006 0M9 19H7a2 2 0 01-2-2v0a2 2 0 012-2h2m6 4h2a2 2 0 002-2v0a2 2 0 00-2-2h-2"/>
                              </svg>
                            </div>
                          </div>
                          <p :class="['text-2xl font-bold transition-all duration-200', animatedDiagnostics.cpuTemp >= 75 ? 'text-red-400' : animatedDiagnostics.cpuTemp >= 60 ? 'text-orange-400' : 'text-emerald-400']">
                            {{ Math.round(animatedDiagnostics.cpuTemp) }}°C
                          </p>
                          <div class="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              :class="['h-full rounded-full transition-all duration-700', animatedDiagnostics.cpuTemp >= 75 ? 'bg-red-400' : animatedDiagnostics.cpuTemp >= 60 ? 'bg-orange-400' : 'bg-emerald-400']"
                              :style="{ width: `${Math.min(animatedDiagnostics.cpuTemp, 100)}%` }"
                            ></div>
                          </div>
                          <p class="text-xs text-gray-500 mt-1.5">Max 100°C threshold</p>
                        </div>

                        <!-- RAM Usage -->
                        <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-5 transition-all duration-300 hover:shadow-lg group">
                          <div class="flex items-center justify-between mb-3">
                            <p class="text-sm text-gray-400">RAM Usage</p>
                            <div :class="['p-2 rounded-lg transition-transform duration-200 group-hover:scale-110', animatedDiagnostics.ramUsage >= 85 ? 'bg-red-500/20' : animatedDiagnostics.ramUsage >= 70 ? 'bg-orange-500/20' : 'bg-blue-500/20']">
                              <svg :class="['w-5 h-5', animatedDiagnostics.ramUsage >= 85 ? 'text-red-400' : animatedDiagnostics.ramUsage >= 70 ? 'text-orange-400' : 'text-blue-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                              </svg>
                            </div>
                          </div>
                          <p :class="['text-2xl font-bold transition-all duration-200', animatedDiagnostics.ramUsage >= 85 ? 'text-red-400' : animatedDiagnostics.ramUsage >= 70 ? 'text-orange-400' : 'text-blue-400']">
                            {{ Math.round(animatedDiagnostics.ramUsage) }}%
                          </p>
                          <div class="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              :class="['h-full rounded-full transition-all duration-700', animatedDiagnostics.ramUsage >= 85 ? 'bg-red-400' : animatedDiagnostics.ramUsage >= 70 ? 'bg-orange-400' : 'bg-blue-400']"
                              :style="{ width: `${animatedDiagnostics.ramUsage}%` }"
                            ></div>
                          </div>
                          <p class="text-xs text-gray-500 mt-1.5">of available memory</p>
                        </div>

                        <!-- Disk Space -->
                        <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-5 transition-all duration-300 hover:shadow-lg group">
                          <div class="flex items-center justify-between mb-3">
                            <p class="text-sm text-gray-400">Disk Space</p>
                            <div :class="['p-2 rounded-lg transition-transform duration-200 group-hover:scale-110', animatedDiagnostics.diskSpace >= 85 ? 'bg-red-500/20' : animatedDiagnostics.diskSpace >= 70 ? 'bg-orange-500/20' : 'bg-purple-500/20']">
                              <svg :class="['w-5 h-5', animatedDiagnostics.diskSpace >= 85 ? 'text-red-400' : animatedDiagnostics.diskSpace >= 70 ? 'text-orange-400' : 'text-purple-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm0 5h16M8 16h.01"/>
                              </svg>
                            </div>
                          </div>
                          <p :class="['text-2xl font-bold transition-all duration-200', animatedDiagnostics.diskSpace >= 85 ? 'text-red-400' : animatedDiagnostics.diskSpace >= 70 ? 'text-orange-400' : 'text-purple-400']">
                            {{ Math.round(animatedDiagnostics.diskSpace) }}%
                          </p>
                          <div class="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              :class="['h-full rounded-full transition-all duration-700', animatedDiagnostics.diskSpace >= 85 ? 'bg-red-400' : animatedDiagnostics.diskSpace >= 70 ? 'bg-orange-400' : 'bg-purple-400']"
                              :style="{ width: `${animatedDiagnostics.diskSpace}%` }"
                            ></div>
                          </div>
                          <p class="text-xs text-gray-500 mt-1.5">of eMMC storage used</p>
                        </div>

                        <!-- Board Type -->
                        <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-5 transition-all duration-300 hover:shadow-lg group">
                          <div class="flex items-center justify-between mb-3">
                            <p class="text-sm text-gray-400">Board Type</p>
                            <div class="p-2 bg-indigo-500/20 rounded-lg transition-transform duration-200 group-hover:scale-110">
                              <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                              </svg>
                            </div>
                          </div>
                          <p class="text-xl font-bold text-color transition-all duration-200">Toradex Apalis</p>
                          <div class="mt-3 flex flex-wrap gap-1.5">
                            <span class="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full px-2 py-0.5">ARM64</span>
                            <span class="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full px-2 py-0.5">SOM</span>
                            <span class="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full px-2 py-0.5">Docker</span>
                          </div>
                          <p class="text-xs text-gray-500 mt-1.5">iMX8 · Toradex BSP</p>
                        </div>

                      </div>
                    </div>

                    <!-- App Info Cards -->
                    <div v-if="hasAppInfoData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AppInfoCard
                        v-for="(info, idx) in appInfoData"
                        :key="idx"
                        :info="info"
                        :smallVersion="false"
                      />
                    </div>
                  </div>
                </template>
                <template v-else-if="showPortfolio">
                  <PortfolioCard @project-selected="handleProjectSelected" />
                </template>
                <template v-else-if="showProfile">
                  <ProfileCard />
                </template>
              </transition>
            </div>
              <div
                v-if="activeModal === 'appInfo' && showAppInfoCard"
                id="popup-modal"
                tabindex="-1"
                :class="[
                  'appinfo-modal-transition',
                  'flex',
                  'py-20',
                  'w-full',
                  'h-full',
                  'flex flex-col',
                  sidebarOpen ? 'md:ml-64' : '',
                ]"
                style="
                  position: fixed;
                  inset: 0;
                  pointer-events: none;
                "
              >
                <div
                  class="px-4 py-8 pointer-events-auto flex items-start justify-start"
                  style="margin-left: 0"
                >
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-0 internal-grid-borders"
                  >
                    <AppInfoCard
                      v-for="(info, idx) in filteredAppInfoData"
                      :key="idx"
                      :info="info"
                      :smallVersion="false"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="ml-10 relative overflow-visible">
                      <StatusElementCard
                        title="CPU Temp"
                        :value="diagnostics.cpuTemp"
                        :mainValue="diagnostics.cpuTemp + 'C'"
                        :maxValue="100"
                        :secondaryValues="diagnostics.cpuTemps"
                        :size="72"
                        :stroke="10"
                        type="cpu"
                      />
                      <StatusElementCard
                        title="RAM Usage"
                        :value="diagnostics.ramUsage"
                        :mainValue="diagnostics.ramUsage + '%'"
                        :maxValue="maxRamValue"
                        :secondaryValues="diagnostics.ramUsages"
                        :size="72"
                        :stroke="10"
                        type="ram"
                      />
                      <StatusElementCard
                        title="Disk Space"
                        :value="diagnostics.diskSpace"
                        :mainValue="diagnostics.diskSpace + '%'"
                        :size="72"
                        :stroke="10"
                        type="disk"
                      />
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmationToast ref="toastRef" />
</template>

<style scoped>
.info-btn {
  position: relative;
  overflow: hidden;
}
.info-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(115deg, transparent 30%, rgba(168,85,247,0.35) 50%, transparent 70%);
  background-size: 200% 100%;
  animation: btn-shine 2.4s ease-in-out infinite;
}
@keyframes btn-shine {
  0%   { background-position: 200% center; }
  60%  { background-position: -200% center; }
  100% { background-position: -200% center; }
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.internal-grid-borders {
  position: relative;
}
.internal-grid-borders > * {
  position: relative;
}
@media (min-width: 768px) {
  .internal-grid-borders > :not(:nth-child(3n))::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background-color: var(--grid-border-color);
    z-index: 10;
  }
  .internal-grid-borders > :nth-child(-n + 3)::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: var(--grid-border-color);
    z-index: 10;
  }
}
@media (max-width: 767px) {
  .internal-grid-borders > *::after,
  .internal-grid-borders > *::before {
    display: none !important;
  }
}

.shape-fill {
  fill: #e5e7eb;
  transition: fill 0.1s;
}
:root .shape-fill {
  fill: #e5e7eb;
}
.dark .shape-fill {
  fill: #303030;
}
/* Modern dashboard modal transition */
.dashboard-fade-slide-enter-active, .dashboard-fade-slide-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
/* Dashboard modal slides in from left, returns to original position */
.dashboard-fade-slide-enter-from, .dashboard-fade-slide-leave-to {
  opacity: 0;
  transform: scale(1) translateX(40px);
  filter: blur(5px);
}
.dashboard-fade-slide-enter-to, .dashboard-fade-slide-leave-from {
  opacity: 1;
  transform: scale(1) translateX(0);
  filter: blur(0);
}
/* AppInfoCard floating slide-right transition */
.appinfo-slide-right-enter-active, .appinfo-slide-right-leave-active {
  transition: opacity 0.15s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1);
}
/* AppInfoCard floats in from right, returns to original position */
.appinfo-slide-right-enter-from, .appinfo-slide-right-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(1);
  filter: blur(5px);
}
.appinfo-slide-right-enter-to, .appinfo-slide-right-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
  filter: blur(0);
}
</style>
