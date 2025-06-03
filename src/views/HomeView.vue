<script setup>
import { ref, watch } from "vue";
import Sidebar from "../components/sidebar/Sidebar.vue";
import ConfigurationModal from "../components/Modals/ConfigurationModal.vue";
import Navbar from "../components/navbar/Navbar.vue";
import ConfigurationCard from "../components/tabs/OptConfigurationCard.vue";
import UserInterfaceCard from "../components/tabs/UserInterfaceCard.vue";
import ConfirmationToast from "../components/toasts/ConfirmationToast.vue";
import ConfirmConfigurationChanges from "../components/Modals/ConfirmConfigurationChangesModal.vue";
import ConfigurationTemplateModal from "../components/Modals/ConfigurationTemplateModal.vue";
import Footer from "../components/footer/Footer.vue";

// State for OPT Configuration
const showConfigModal = ref(false);
const sidebarOpen = ref(true);
const optConfiguration = ref(null);
const newOptConfiguration = ref(null);
const showOPTConfiguration = ref(false);

// State for User Interface Configuration
const userInterfaceConfig = ref(null);
const newUserInterfaceConfig = ref(null);
const showUserInterfaceConfig = ref(false);

const showOPTConfigurationTemplate = ref(false);
const toastRef = ref(null);
const diffModalRef = ref(null);
const uiDiffModalRef = ref(null);
const templateData = ref({});

// Animation control
const pendingToShow = ref(null);

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
  if (showUserInterfaceConfig.value) {
    // If UI config is visible, wait for animation to finish before showing OPT config
    pendingToShow.value = { type: "opt", data };
    showUserInterfaceConfig.value = false;
  } else {
    showOPTConfiguration.value = true;
    optConfiguration.value = data;
  }
}

function handleUserInterfaceConfig(data) {
  if (showOPTConfiguration.value) {
    // If OPT config is visible, wait for animation to finish before showing UI config
    pendingToShow.value = { type: "ui", data };
    showOPTConfiguration.value = false;
  } else {
    showUserInterfaceConfig.value = true;
    userInterfaceConfig.value = data;
  }
}

function handleUpdateConfiguration(data) {
  newOptConfiguration.value = data;
  diffModalRef.value?.showDiff(optConfiguration.value, newOptConfiguration.value.config, 'opt');
}

function handleUpdateUserInterfaceConfig(data) {
  newUserInterfaceConfig.value = data;
  uiDiffModalRef.value?.showDiff(userInterfaceConfig.value, newUserInterfaceConfig.value.config, 'ui');
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
  { label: "Add Configuration", completed: true, description: "Fill in the configuration details to get started." },
  { label: "Template Details", completed: false, description: "Review and complete the template details before saving." },
];
const currentStep = ref(0);

watch(showConfigModal, (val) => {
  if (val) currentStep.value = 0;
});
watch(showOPTConfigurationTemplate, (val) => {
  if (val) currentStep.value = 1;
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
          v-if="showOPTConfiguration"
          :show="showOPTConfiguration"
          :data="optConfiguration || {}"
          @update="handleUpdateConfiguration"
        />
      </transition>

      <transition name="fade-slide" @after-leave="onUiConfigAfterLeave">
        <UserInterfaceCard
          v-if="showUserInterfaceConfig"
          :show="showUserInterfaceConfig"
          :data="userInterfaceConfig || {}"
          @update="handleUpdateUserInterfaceConfig"
        />
      </transition>
      
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
