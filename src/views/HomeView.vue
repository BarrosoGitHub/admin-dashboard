<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import ConfigurationModal from "../components/Modals/ConfigurationModal.vue";
import Navbar from "../components/navbar/Navbar.vue";
import ConfigurationCard from "../components/tabs/OptConfigurationCard.vue";
import UserInterfaceCard from "../components/tabs/UserInterfaceCard.vue";
import ConfirmationToast from "../components/toasts/ConfirmationToast.vue";
import ConfirmConfigurationChanges from "../components/Modals/ConfirmConfigurationChangesModal.vue";
import ConfigurationTemplateModal from "../components/Modals/ConfigurationTemplateModal.vue";
import PasswordChangeModal from "../components/Modals/PasswordChangeModal.vue";
import AppInfoCard from "../components/tabs/AppInfoCard.vue";
import NetworkConfigurationCard from "../components/tabs/NetworkConfigurationCard.vue";
import StatusElementCard from "../components/tabs/StatusElementCard.vue";
import { API_BASE_URL, WS_BASE_URL } from '@/apiConfig.js';
const diagnostics = ref({
  cpuTemp: 0,
  ramUsage: 0,
  diskSpace: 0,
  cpuTemps: [],
  ramUsages: []
});

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
const showOPTConfiguration = ref(false);
const showUserInterfaceConfig = ref(false);
const showAppInfoCard = ref(false);
const showNetworkConfiguration = ref(false);
const showConfigModal = ref(false);
const showOPTConfigurationTemplate = ref(false);
const showPasswordChangeModal = ref(false);

// --- Data refs ---
const optConfiguration = ref(null);
const newOptConfiguration = ref(null);
const userInterfaceConfig = ref(null);
const newUserInterfaceConfig = ref(null);
const appInfoData = ref([]);
const networkConfiguration = ref({});
const templateData = ref({});

// --- Component refs ---
const sidebarOpen = ref(false);
const toastRef = ref(null);
const diffModalRef = ref(null);
const uiDiffModalRef = ref(null);

// --- Search functionality ---
const searchValue = ref("");
const activeCardName = computed(() => {
  switch (activeModal.value) {
    case 'opt': return 'OPT Configuration';
    case 'ui': return 'User Interface';
    case 'network': return 'Network Configuration';
    case 'appInfo': return 'App Information';
    default: return '';
  }
});

const showSearchForActiveCard = computed(() => {
  // Only show search for cards that have searchable content
  return activeModal.value === 'opt' || activeModal.value === 'ui' || activeModal.value === 'appInfo';
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

// --- Stepper configuration ---
const stepperSteps = [
  {
    label: "Add Configuration",
    completed: true,
    description: "Fill in the configuration details to get started.",
  },
  {
    label: "Template Details",
    completed: false,
    description: "Review and complete the template details before saving.",
  },
];
const currentStep = ref(0);

// --- Persistence helpers ---
function persistModalState() {
  const state = {
    activeModal: activeModal.value,
    showOPTConfiguration: showOPTConfiguration.value,
    showUserInterfaceConfig: showUserInterfaceConfig.value,
    showAppInfoCard: showAppInfoCard.value,
    optConfiguration: optConfiguration.value,
    userInterfaceConfig: userInterfaceConfig.value,
    appInfoData: appInfoData.value,
  };
  localStorage.setItem("modalState", JSON.stringify(state));
}

function restoreModalState() {
  const stateStr = localStorage.getItem("modalState");
  if (!stateStr) return;
  try {
    const state = JSON.parse(stateStr);
    activeModal.value = state.activeModal;
    showOPTConfiguration.value = state.showOPTConfiguration;
    showUserInterfaceConfig.value = state.showUserInterfaceConfig;
    showAppInfoCard.value = state.showAppInfoCard;
    optConfiguration.value = state.optConfiguration;
    userInterfaceConfig.value = state.userInterfaceConfig;
    appInfoData.value = state.appInfoData;
  } catch {}
}

// Watchers to persist state
watch(
  [
    activeModal,
    showOPTConfiguration,
    showUserInterfaceConfig,
    showAppInfoCard,
    optConfiguration,
    userInterfaceConfig,
    appInfoData,
  ],
  persistModalState,
  { deep: true }
);

function openConfigModal() {
  showConfigModal.value = true;
}

function handleConfigSubmitted(responseData) {
  templateData.value = responseData;
  showOPTConfigurationTemplate.value = true;
}

function showOPTConfigAddedToast() {
  toastRef.value?.showConfirmationToast("Configuration successfully added!", true);
}

function handleOptConfiguration(data) {
  optConfiguration.value = data;
  activeModal.value = "opt";
  showUserInterfaceConfig.value = false;
  showAppInfoCard.value = false;
  showOPTConfiguration.value = true;
}

function handleUserInterfaceConfig(data) {
  userInterfaceConfig.value = data;
  activeModal.value = "ui";
  showOPTConfiguration.value = false;
  showAppInfoCard.value = false;
  showUserInterfaceConfig.value = true;
}

function handleNetworkConfiguration(data) {
  // Map backend fields to frontend expected fields
  networkConfiguration.value = {
    ipv4: data.IPAddress || '',
    netmask: data.SubnetMask || '',
    gateway: data.DefaultGateway || '',
    dhcpActive: !!data.IsDhcpEnabled,
    ntpAddress: data.NtpAddress || '',
    ntpActive: data.NtpActive ?? null // can be true, false, or null
  };
  activeModal.value = "network";
  showNetworkConfiguration.value = true;
  showOPTConfiguration.value = false;
  showUserInterfaceConfig.value = false;
  showAppInfoCard.value = false;
}

function handleUpdateConfiguration(data) {
  newOptConfiguration.value = data;
  diffModalRef.value?.showDiff(
    optConfiguration.value,
    newOptConfiguration.value.config,
    "opt"
  );
  showOPTConfiguration.value = true;
}

function handleUpdateUserInterfaceConfig(data) {
  newUserInterfaceConfig.value = data;
  uiDiffModalRef.value?.showDiff(
    userInterfaceConfig.value,
    newUserInterfaceConfig.value.config,
    "ui"
  );
  showUserInterfaceConfig.value = true;
}

watch(showConfigModal, (val) => {
  if (val) currentStep.value = 0;
});
watch(showOPTConfigurationTemplate, (val) => {
  if (val) currentStep.value = 1;
});

function handleDashboard(data) {
  appInfoData.value = Array.isArray(data) ? data : [data];
  activeModal.value = "appInfo";
  showOPTConfiguration.value = false;
  showUserInterfaceConfig.value = false;
  showAppInfoCard.value = true;
}

function resetAllModals() {
  activeModal.value = null;
  showOPTConfiguration.value = false;
  showUserInterfaceConfig.value = false;
  showAppInfoCard.value = false;
  showNetworkConfiguration.value = false;
  showPasswordChangeModal.value = false;
  optConfiguration.value = null;
  userInterfaceConfig.value = null;
  appInfoData.value = [];
}

function handlePasswordChange() {
  showPasswordChangeModal.value = true;
}

function handlePasswordChangeSuccess() {
  toastRef.value?.showConfirmationToast("Password changed successfully!", true);
}

function handleNetworkResponse(response) {
  toastRef.value?.showConfirmationToast(response.message, response.success);
}

// Listen for logout event (dispatched from Avatar.vue)
window.addEventListener("sidebar-close", resetAllModals);

onMounted(() => {
  setTimeout(() => {
    sidebarOpen.value = true;
  }, 150); // Adjust delay as needed for effect

  // Restore modal state on refresh
  restoreModalState();

  // Show dashboard if coming from login
  if (localStorage.getItem("showDashboardOnHome") === "true") {
    localStorage.removeItem("showDashboardOnHome");
    // Fetch dashboard data (same as handleDashboardClick in Sidebar)
    const token = localStorage.getItem("jwt");
    import("axios").then(({ default: axios }) => {
      axios
        .get(`${API_BASE_URL}/info/services`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((response) => {
          handleDashboard(response.data);
        })
        .catch(() => {
          handleDashboard([]);
        });
    });
  }

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
    
    diagnostics.value.cpuTemp = Math.round(cpuAverage);
    diagnostics.value.cpuTemps = Object.entries(data.cpuTemperatures)
      .map(([key, value]) => `${key}: ${value}°C`);
  } else {
    diagnostics.value.cpuTemp = 0;
    diagnostics.value.cpuTemps = [];
  }
  
  // RAM Usage processing
  if (data.ramUsage?.total && data.ramUsage?.load) {
    diagnostics.value.ramUsage = Math.round((data.ramUsage.load / data.ramUsage.total) * 100);
    diagnostics.value.ramUsages = Object.entries(data.ramUsage)
      .map(([key, value]) => `${key}: ${value} Mb`);
  } else {
    diagnostics.value.ramUsage = 0;
    diagnostics.value.ramUsages = [];
  }
  
  // Disk Space processing
  if (Array.isArray(data.diskSpace) && data.diskSpace.length > 0) {
    const root = data.diskSpace.find(d => d.mount === "/") || data.diskSpace[0];
    diagnostics.value.diskSpace = root?.percentUsed ? Math.round(root.percentUsed) : 0;
  } else {
    diagnostics.value.diskSpace = 0;
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
  <div class="custom-shape-divider-bottom-1750243590">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
    </svg>
</div>
  <div class="bg-website-color-gradient min-h-screen min-w-screen">
  
    <Sidebar
      :show="sidebarOpen"
      @show-configuration-modal="openConfigModal"
      @sidebar-toggle="sidebarOpen = $event"
      @opt-configuration="handleOptConfiguration"
      @user-interface-configuration="handleUserInterfaceConfig"
      @dashboard="handleDashboard"
      @network-configuration="handleNetworkConfiguration"
      @password-change="handlePasswordChange"
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
          />

          <div class="flex flex-col md:flex-row md:space-x-4">
          
            <div class="flex-1">
              <ConfigurationModal
                :show="showConfigModal"
                @close="showConfigModal = false"
                @submitted="handleConfigSubmitted"
              />
              <ConfigurationTemplateModal
                :show="showOPTConfigurationTemplate"
                :data="templateData || {}"
                @submit="showOPTConfigurationTemplate = false"
              />
              <PasswordChangeModal
                :show="showPasswordChangeModal"
                @close="showPasswordChangeModal = false"
                @success="handlePasswordChangeSuccess"
              />
              <transition :key="activeModal" mode="out-in">
                <template v-if="activeModal === 'opt' && showOPTConfiguration">
                  <ConfigurationCard
                    :show="showOPTConfiguration"
                    :data="optConfiguration || {}"
                    :searchValue="searchValue"
                    @update="handleUpdateConfiguration"
                  />
                </template>
                <template v-else-if="activeModal === 'ui' && showUserInterfaceConfig">
                  <UserInterfaceCard
                    :show="showUserInterfaceConfig"
                    :data="userInterfaceConfig || {}"
                    :searchValue="searchValue"
                    @update="handleUpdateUserInterfaceConfig"
                  />
                </template>
                <template v-else-if="activeModal === 'network' && showNetworkConfiguration">
                  <NetworkConfigurationCard
                    :modelValue="networkConfiguration"
                    @response="handleNetworkResponse"
                  />
                </template>
              </transition>
            </div>
            <div
              v-if="hasAppInfoData && activeModal !== 'appInfo'"
              class="flex flex-col items-end pt-5 pr-4 mr-20 z-40"
              style="pointer-events: none"
            >
              <div style="pointer-events: auto">
                <AppInfoCard
                  v-for="(info, idx) in filteredAppInfoData"
                  :key="idx"
                  :info="info"
                  :smallVersion="true"
                />
              </div>
            </div>
            <!-- AppInfoCards in original position when dashboard is open -->
            <transition name="">
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
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmConfigurationChanges
    ref="diffModalRef"
    @on-updated-data="handleOptConfiguration"
  />
  <ConfirmConfigurationChanges
    ref="uiDiffModalRef"
    @on-updated-data="handleUserInterfaceConfig"
  />
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
</style>
