<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import ConfigurationModal from "../components/Modals/ConfigurationModal.vue";
import Navbar from "../components/navbar/Navbar.vue";
import ConfigurationCard from "../components/tabs/OptConfigurationCard.vue";
import UserInterfaceCard from "../components/tabs/UserInterfaceCard.vue";
import ConfirmationToast from "../components/toasts/ConfirmationToast.vue";
import ConfirmConfigurationChanges from "../components/Modals/ConfirmConfigurationChangesModal.vue";
import ConfigurationTemplateModal from "../components/Modals/ConfigurationTemplateModal.vue";
import AppInfoCard from "../components/tabs/AppInfoCard.vue";
import NetworkConfigurationCard from "../components/tabs/NetworkConfigurationCard.vue";
import StatusElementCard from "../components/tabs/StatusElementCard.vue";
import { API_BASE_URL, WS_BASE_URL } from '@/apiConfig.js';

const diagnostics = ref({
  cpuTemp: 54,
  ramUsage: 62,
  diskSpace: 78,
  cpuTemps: []
});
let ws = null;

const showConfigModal = ref(false);
const sidebarOpen = ref(false);
const optConfiguration = ref(null);
const newOptConfiguration = ref(null);
const showOPTConfiguration = ref(false);
const userInterfaceConfig = ref(null);
const newUserInterfaceConfig = ref(null);
const showUserInterfaceConfig = ref(false);
const showAppInfoCard = ref(false);
const appInfoData = ref({});
const showOPTConfigurationTemplate = ref(false);
const toastRef = ref(null);
const diffModalRef = ref(null);
const uiDiffModalRef = ref(null);
const templateData = ref({});
const activeModal = ref(null);
const showNetworkConfiguration = ref(false);
const networkConfiguration = ref({});

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

watch([
  activeModal,
  showOPTConfiguration,
  showUserInterfaceConfig,
  showAppInfoCard,
  optConfiguration,
  userInterfaceConfig,
  appInfoData,
], persistModalState, { deep: true });

function openConfigModal() { showConfigModal.value = true; }
function handleConfigSubmitted(responseData) { templateData.value = responseData; showOPTConfigurationTemplate.value = true; }
function showOPTConfigAddedToast() { toastRef.value?.showConfirmationToast("Configuration successfully added!", true); }
function handleOptConfiguration(data) { optConfiguration.value = data; activeModal.value = "opt"; showUserInterfaceConfig.value = false; showAppInfoCard.value = false; showOPTConfiguration.value = true; }
function handleUserInterfaceConfig(data) { userInterfaceConfig.value = data; activeModal.value = "ui"; showOPTConfiguration.value = false; showAppInfoCard.value = false; showUserInterfaceConfig.value = true; }
function handleNetworkConfiguration(data) {
  networkConfiguration.value = {
    ipv4: data.IPAddress || '',
    netmask: data.SubnetMask || '',
    gateway: data.DefaultGateway || '',
    dhcpActive: !!data.IsDhcpEnabled,
    ntpAddress: data.NtpAddress || '',
    ntpActive: data.NtpActive ?? null
  };
  activeModal.value = "network";
  showNetworkConfiguration.value = true;
  showOPTConfiguration.value = false;
  showUserInterfaceConfig.value = false;
  showAppInfoCard.value = false;
}
function handleUpdateConfiguration(data) {
  newOptConfiguration.value = data;
  diffModalRef.value?.showDiff(optConfiguration.value, newOptConfiguration.value.config, "opt");
  showOPTConfiguration.value = true;
}
function handleUpdateUserInterfaceConfig(data) {
  newUserInterfaceConfig.value = data;
  uiDiffModalRef.value?.showDiff(userInterfaceConfig.value, newUserInterfaceConfig.value.config, "ui");
  showUserInterfaceConfig.value = true;
}
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
  optConfiguration.value = null;
  userInterfaceConfig.value = null;
  appInfoData.value = {};
}
window.addEventListener("sidebar-close", resetAllModals);

onMounted(() => {
  setTimeout(() => { sidebarOpen.value = true; }, 150);
  restoreModalState();
  if (localStorage.getItem("showDashboardOnHome") === "true") {
    localStorage.removeItem("showDashboardOnHome");
    const token = localStorage.getItem("jwt");
    import("axios").then(({ default: axios }) => {
      axios.get(`${API_BASE_URL}/info/services`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        .then((response) => { handleDashboard(response.data); })
        .catch(() => { handleDashboard([]); });
    });
  }
  ws = new WebSocket(`${WS_BASE_URL}/ws/stats`);
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      let cpu0 = null, cpu1 = null;
      let cpuTempsArr = [];
      if (data.cpuTemperatures && typeof data.cpuTemperatures === 'object') {
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
        cpuTempsArr = Object.entries(data.cpuTemperatures)
          .map(([key, value]) => `${key}: ${value}°C`);
        diagnostics.value.cpuTemps = cpuTempsArr;
      } else {
        diagnostics.value.cpuTemp = 0;
        diagnostics.value.cpuTemps = [];
      }
      if (data.ramUsage && data.ramUsage.total && data.ramUsage.load) {
        diagnostics.value.ramUsage = Math.round((data.ramUsage.load/ data.ramUsage.total) * 100);
        diagnostics.value.ramUsages = Object.entries(data.ramUsage)
          .map(([key, value]) => `${key}: ${value} Mb`);
      } else {
        diagnostics.value.ramUsage = 0;
      }
      if (Array.isArray(data.diskSpace) && data.diskSpace.length > 0) {
        const root = data.diskSpace.find(d => d.mount === "/") || data.diskSpace[0];
        if (root && typeof root.percentUsed === 'number') {
          diagnostics.value.diskSpace = Math.round(root.percentUsed);
        } else {
          diagnostics.value.diskSpace = 0;
        }
      } else {
        diagnostics.value.diskSpace = 0;
      }
    } catch (e) {
      diagnostics.value.cpuTemp = 0;
      diagnostics.value.ramUsage = 0;
      diagnostics.value.diskSpace = 0;
    }
  };
  ws.onerror = () => {};
  ws.onclose = () => {};
});
onBeforeUnmount(() => { if (ws) { ws.close(); ws = null; } });
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
    />
    <div :class="['flex flex-col', sidebarOpen ? 'md:ml-64' : '']">
      <div class="flex-1 md:flex-row">
        <div class="flex-1">
          <Navbar @sidebar-toggle="sidebarOpen = !sidebarOpen" />
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
              <transition name="">
                <ConfigurationCard
                  v-if="activeModal === 'opt' && showOPTConfiguration"
                  :show="showOPTConfiguration"
                  :data="optConfiguration || {}"
                  @update="handleUpdateConfiguration"
                />
              </transition>
              <transition name="">
                <UserInterfaceCard
                  v-if="activeModal === 'ui' && showUserInterfaceConfig"
                  :show="showUserInterfaceConfig"
                  :data="userInterfaceConfig || {}"
                  @update="handleUpdateUserInterfaceConfig"
                />
              </transition>
              <transition name="">
                <NetworkConfigurationCard
                  v-if="activeModal === 'network' && showNetworkConfiguration"
                  :modelValue="networkConfiguration"
                  @close="showNetworkConfiguration = false; activeModal = null;"
                  @submit="showNetworkConfiguration = false; activeModal = null;"
                />
              </transition>
            </div>
            <div
              v-if="appInfoData && appInfoData.length && activeModal !== 'appInfo'"
              class="flex flex-col items-end pt-5 pr-4 mr-20 z-40"
              style="pointer-events: none"
            >
              <div style="pointer-events: auto">
                <AppInfoCard
                  v-for="(info, idx) in appInfoData"
                  :key="idx"
                  :info="info"
                  :smallVersion="true"
                />
              </div>
            </div>
            <transition name="">
              <div
                v-if="activeModal === 'appInfo' && showAppInfoCard"
                id="popup-modal"
                tabindex="-1"
                :class=" [
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
                  background: rgba(24, 24, 24, 0.18);
                  pointer-events: none;
                "
              >
                <div
                  class="relative p-2 md:p-8 pointer-events-auto w-full max-w-9xl flex items-start justify-start"
                  style="margin-left: 0"
                >
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-0 internal-grid-borders"
                  >
                    <AppInfoCard
                      v-for="(info, idx) in appInfoData"
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
                        :maxValue="Number((diagnostics.ramUsages.find(e => e.toLowerCase().startsWith('total')) || '').split(':')[1]?.replace('Mb','').trim())"
                        :secondaryValues="diagnostics.ramUsages && diagnostics.ramUsages"
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
  <ConfirmationToast ref="toastRef" />
  <ConfirmConfigurationChanges ref="diffModalRef" @on-updated-data="handleOptConfiguration" />
  <ConfirmConfigurationChanges ref="uiDiffModalRef" @on-updated-data="handleUserInterfaceConfig" />
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
    background: #292929;
    z-index: 10;
  }
  .internal-grid-borders > :nth-child(-n + 3)::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #292929;
    z-index: 10;
  }
}
@media (max-width: 767px) {
  .internal-grid-borders > *::after,
  .internal-grid-borders > *::before {
    display: none !important;
  }
}
</style>
