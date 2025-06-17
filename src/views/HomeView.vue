<script setup>
import { ref, watch, onMounted } from "vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import ConfigurationModal from "../components/Modals/ConfigurationModal.vue";
import Navbar from "../components/navbar/Navbar.vue";
import ConfigurationCard from "../components/tabs/OptConfigurationCard.vue";
import UserInterfaceCard from "../components/tabs/UserInterfaceCard.vue";
import ConfirmationToast from "../components/toasts/ConfirmationToast.vue";
import ConfirmConfigurationChanges from "../components/Modals/ConfirmConfigurationChangesModal.vue";
import ConfigurationTemplateModal from "../components/Modals/ConfigurationTemplateModal.vue";
import Footer from "../components/footer/Footer.vue";
import AppInfoCard from "../components/tabs/AppInfoCard.vue";
import NetworkConfigurationCard from "../components/tabs/NetworkConfigurationCard.vue";

// State for OPT Configuration
const showConfigModal = ref(false);
const sidebarOpen = ref(false);
const optConfiguration = ref(null);
const newOptConfiguration = ref(null);
const showOPTConfiguration = ref(false);

// State for User Interface Configuration
const userInterfaceConfig = ref(null);
const newUserInterfaceConfig = ref(null);
const showUserInterfaceConfig = ref(false);

// State for App Info Card
const showAppInfoCard = ref(false);
const appInfoData = ref({});

const showOPTConfigurationTemplate = ref(false);
const toastRef = ref(null);
const diffModalRef = ref(null);
const uiDiffModalRef = ref(null);
const templateData = ref({});

// Animation control
const pendingToShow = ref(null);
const activeModal = ref(null); // 'opt', 'ui', 'appInfo', or null

// State for Network Configuration
const showNetworkConfiguration = ref(false);
const networkConfiguration = ref({});

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
  networkConfiguration.value = data;
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
  optConfiguration.value = null;
  userInterfaceConfig.value = null;
  appInfoData.value = {};
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
        .get("http://localhost:5087/info/services", {
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
});
</script>

<template>
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
      <!-- Main content and left cards -->
      <div class="flex-1 md:flex-row">
        <div class="flex-1">
          <Navbar @sidebar-toggle="sidebarOpen = !sidebarOpen" />
          <div class="w-full flex items-start justify-start mt-2">
            <slot name="below-navbar" />
          </div>
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
              class="flex flex-col items-end pt-5 pr-4 mr-20 z-40 "
              style="pointer-events: none"
            >
              <div style="pointer-events: auto; ">
                <AppInfoCard
                  v-for="(info, idx) in appInfoData"
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
                  'justify-center',
                  'items-center',
                  'w-full',
                  'h-full',
                  'flex flex-col', sidebarOpen ? 'md:ml-64' : ''
                ]"
                style="
                  position: fixed;
                  inset: 0;
                  z-index: 50;
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
                </div>
              </div>
            </transition>
          </div>
        </div>
        <!-- AppInfoCards always visible, except when dashboard is open -->
      </div>
    </div>
  </div>

  <ConfirmationToast ref="toastRef" />
  <ConfirmConfigurationChanges
    ref="diffModalRef"
    @on-updated-data="handleOptConfiguration"
  />
  <ConfirmConfigurationChanges
    ref="uiDiffModalRef"
    @on-updated-data="handleUserInterfaceConfig"
  />
</template>

<style scoped>
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  /* transform: translateY(30px); */
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
    background: #292929; /* Tailwind gray-300 */
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
