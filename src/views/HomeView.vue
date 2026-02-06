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
  cpuTemp: 0,
  ramUsage: 0,
  diskSpace: 0
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

// --- Data refs ---
const appInfoData = ref([]);
const showDashboard = ref(false);
const dashboardStats = ref({
  displayStatus: 'Active',
  impressions: '12.4K',
  adsPlayed: 342,
  containers: 5
});
const chartData = ref([1240, 1580, 1420, 1890, 1650, 2100, 1950]);

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
    case 'profile': return 'Curriculum Vitae';
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
            :searchValue="searchValue"
            :showSearch="showSearchForActiveCard"
            :activeCard="activeCardName"
            :sidebarOpen="sidebarOpen"
          />

          <div class="flex flex-col md:flex-row md:space-x-4">
          
            <div class="flex-1">
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
                      <button 
                        @click="handlePortfolio"
                        class="px-4 py-2 bg-modal-color-gradient border border-color rounded-lg text-color hover:shadow-lg transition-all duration-200"
                      >
                        ← Back to Projects
                      </button>
                    </div>

                    <!-- Stats Cards Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatsCard 
                        title="Display Status" 
                        :value="dashboardStats.displayStatus"
                        change="24/7"
                        changeType="up"
                        iconType="display"
                      />
                      <StatsCard 
                        title="Impressions" 
                        :value="dashboardStats.impressions"
                        change="+18%"
                        changeType="up"
                        iconType="impressions"
                      />
                      <StatsCard 
                        title="Ads Played Today" 
                        :value="dashboardStats.adsPlayed"
                        change="+23"
                        changeType="up"
                        iconType="ads"
                      />
                      <StatsCard 
                        title="Active Containers" 
                        :value="dashboardStats.containers"
                        change="Healthy"
                        changeType="up"
                        iconType="containers"
                      />
                    </div>

                    <!-- Charts and Activity Row -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div class="lg:col-span-2">
                        <SimpleChart 
                          title="Ad Impressions (Last 7 Days)" 
                          :data="chartData"
                          :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
                          color="#8B5CF6"
                        />
                      </div>
                      <RecentActivity />
                    </div>

                    <!-- System Stats -->
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg group">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm text-gray-400 dark:text-gray-400 transition-all duration-200">CPU Temp</p>
                            <p class="text-2xl font-bold text-color transition-all duration-200">{{ Math.round(animatedDiagnostics.cpuTemp) }}°C</p>
                          </div>
                          <div class="w-16 h-16">
                            <StatusElementCard
                              title=""
                              :value="diagnostics.cpuTemp"
                              :mainValue="''"
                              :maxValue="100"
                              :secondaryValues="[]"
                              :size="60"
                              :stroke="8"
                              type="cpu"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg group">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm text-gray-400 dark:text-gray-400 transition-all duration-200">RAM Usage</p>
                            <p class="text-2xl font-bold text-color transition-all duration-200">{{ Math.round(animatedDiagnostics.ramUsage) }}%</p>
                          </div>
                          <div class="w-16 h-16">
                            <StatusElementCard
                              title=""
                              :value="diagnostics.ramUsage"
                              :mainValue="''"
                              :maxValue="maxRamValue"
                              :secondaryValues="[]"
                              :size="60"
                              :stroke="8"
                              type="ram"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg group">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm text-gray-400 dark:text-gray-400 transition-all duration-200">Disk Space</p>
                            <p class="text-2xl font-bold text-color transition-all duration-200">{{ Math.round(animatedDiagnostics.diskSpace) }}%</p>
                          </div>
                          <div class="w-16 h-16">
                            <StatusElementCard
                              title=""
                              :value="diagnostics.diskSpace"
                              :mainValue="''"
                              :maxValue="100"
                              :secondaryValues="[]"
                              :size="60"
                              :stroke="8"
                              type="disk"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg group">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm text-gray-400 dark:text-gray-400 transition-all duration-200">Board Type</p>
                            <p class="text-lg font-bold text-color transition-all duration-200">{{ appInfoData[0]?.BoardType || 'Unknown' }}</p>
                          </div>
                          <div class="p-3 bg-indigo-500 rounded-full transition-transform duration-200 group-hover:scale-110">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                            </svg>
                          </div>
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
