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
  if (activeModal.value === "ui") {
    pendingToShow.value = null;
    userInterfaceConfig.value = null;
    showUserInterfaceConfig.value = false;
    // Wait for next tick to ensure transition
    setTimeout(() => {
      optConfiguration.value = data;
      activeModal.value = "opt";
      showOPTConfiguration.value = true;
      showAppInfoCard.value = false;
    }, 0);
  } else {
    optConfiguration.value = data;
    activeModal.value = "opt";
    showOPTConfiguration.value = true;
    showUserInterfaceConfig.value = false;
    showAppInfoCard.value = false;
  }
}

function handleUserInterfaceConfig(data) {
  if (activeModal.value === "opt") {
    pendingToShow.value = null;
    optConfiguration.value = null;
    showOPTConfiguration.value = false;
    setTimeout(() => {
      userInterfaceConfig.value = data;
      activeModal.value = "ui";
      showUserInterfaceConfig.value = true;
      showAppInfoCard.value = false;
    }, 0);
  } else {
    userInterfaceConfig.value = data;
    activeModal.value = "ui";
    showUserInterfaceConfig.value = true;
    showOPTConfiguration.value = false;
    showAppInfoCard.value = false;
  }
}

function handleUpdateConfiguration(data) {
  newOptConfiguration.value = data;
  diffModalRef.value?.showDiff(
    optConfiguration.value,
    newOptConfiguration.value.config,
    "opt"
  );
}

function handleUpdateUserInterfaceConfig(data) {
  newUserInterfaceConfig.value = data;
  uiDiffModalRef.value?.showDiff(
    userInterfaceConfig.value,
    newUserInterfaceConfig.value.config,
    "ui"
  );
}

function onOptConfigAfterLeave() {
  if (pendingToShow.value?.type === "ui") {
    showUserInterfaceConfig.value = true;
    userInterfaceConfig.value = pendingToShow.value.data;
    pendingToShow.value = null;
  }
}
function onUiConfigAfterLeave() {
  if (pendingToShow.value?.type === "opt") {
    showOPTConfiguration.value = true;
    optConfiguration.value = pendingToShow.value.data;
    pendingToShow.value = null;
  }
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
  showAppInfoCard.value = true;
  showOPTConfiguration.value = false;
  showUserInterfaceConfig.value = false;
}

function closeAppInfoCard() {
  showAppInfoCard.value = false;
  activeModal.value = null;
}

onMounted(() => {
  setTimeout(() => {
    sidebarOpen.value = true;
  }, 150); // Adjust delay as needed for effect
});
</script>

<template>
  <div class="bg-website-color min-h-screen">
    <Sidebar
      :show="sidebarOpen"
      @show-configuration-modal="openConfigModal"
      @sidebar-toggle="sidebarOpen = $event"
      @opt-configuration="handleOptConfiguration"
      @user-interface-configuration="handleUserInterfaceConfig"
      @dashboard="handleDashboard"
    />
    <div :class="{ 'ml-64': sidebarOpen }" class="transition-all duration-200">
      <Navbar @sidebar-toggle="sidebarOpen = !sidebarOpen" />

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

      <transition name="fade-slide" @after-leave="onOptConfigAfterLeave">
        <ConfigurationCard
          v-if="activeModal === 'opt' && showOPTConfiguration"
          :show="showOPTConfiguration"
          :data="optConfiguration || {}"
          @update="handleUpdateConfiguration"
        />
      </transition>

      <transition name="fade-slide" @after-leave="onUiConfigAfterLeave">
        <UserInterfaceCard
          v-if="activeModal === 'ui' && showUserInterfaceConfig"
          :show="showUserInterfaceConfig"
          :data="userInterfaceConfig || {}"
          @update="handleUpdateUserInterfaceConfig"
        />
      </transition>
      <div
        v-if="activeModal === 'appInfo' && showAppInfoCard"
        id="popup-modal"
        tabindex="-1"
        class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full pointer-events-none"
      >
        <div class="relative p-4 w-full max-w-5xl max-h-full pointer-events-auto">
            <div class="p-4 md:p-5 text-center">

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AppInfoCard
                  v-for="(info, idx) in appInfoData"
                  :key="idx"
                  :info="info"
                />
              </div>
          </div>
        </div>
      </div>
      <!-- <Footer /> -->
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
