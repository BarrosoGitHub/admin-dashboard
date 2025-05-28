<script setup>
import { ref } from "vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import ConfigurationModal from "./components/Modals/ConfigurationModal.vue";
import Navbar from "./components/navbar/Navbar.vue";
import ConfigurationCard from "./components/tabs/ConfigurationCard.vue";
import ConfirmationToast from "./components/toasts/ConfirmationToast.vue";
import ConfirmConfigurationChanges from "./components/Modals/ConfirmConfigurationChangesModal.vue";
import ConfigurationTemplateModal from "./components/Modals/ConfigurationTemplateModal.vue";
import Footer from "./components/footer/Footer.vue";

const showConfigModal = ref(false);
const sidebarOpen = ref(true);
const optConfiguration = ref(null);
const newOptConfiguration = ref(null);
const showOPTConfiguration = ref(false);
const showOPTConfigurationTemplate = ref(false);
const toastRef = ref(null);
const diffModalRef = ref(null);
const templateData = ref({});

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
  showOPTConfiguration.value = true;
  optConfiguration.value = data;
}

function handleUpdateConfiguration(data) {
  newOptConfiguration.value = data;
  diffModalRef.value?.showDiff(optConfiguration.value, newOptConfiguration.value.config);
}
</script>

<template>
  <div class="bg-website-color min-h-screen">
    <Sidebar
      :show="sidebarOpen"
      @show-configuration-modal="openConfigModal"
      @sidebar-toggle="sidebarOpen = $event"
      @opt-configuration="handleOptConfiguration"
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
      :data="templateData || {}" />

      <transition name="fade-slide">
        <ConfigurationCard
          :show="showOPTConfiguration"
          :data="optConfiguration || {}"
          @update="handleUpdateConfiguration"
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
