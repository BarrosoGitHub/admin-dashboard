<template>
  <div v-if="true" class="py-10 px-25">
    <div class="w-full min-w-[320px] max-w-full md:w-[60vw] md:min-w-[600px] md:max-w-[70vw] rounded-2xl shadow-inner bg-modal-color border border-color flex flex-col">
      <!-- Top line with label -->
      <div class="w-full flex items-center border-b border-color px-8 py-4 mb-2">
        <span class="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">Network Configuration</span>
        <div class="flex-1 flex items-start justify-end"></div>
      </div>
      <div class="flex flex-1 min-h-0">
        <div class="flex-1 min-h-0 flex flex-col justify-center px-8 py-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            <!-- IPv4 Address -->
            <div>
              <InputTransparent
                label="IPv4 Address"
                placeholder="e.g. 192.168.1.100"
                v-model="form.ipv4"
                class="w-full"
              />
            </div>
            <!-- Netmask -->
            <div>
              <InputTransparent
                label="Netmask"
                placeholder="e.g. 255.255.255.0"
                v-model="form.netmask"
                class="w-full"
              />
            </div>
            <!-- Gateway -->
            <div>
              <InputTransparent
                label="Gateway"
                placeholder="e.g. 192.168.1.1"
                v-model="form.gateway"
                class="w-full"
              />
            </div>
            <!-- NTP Address -->
            <div>
              <InputTransparent
                label="NTP Address"
                placeholder="e.g. pool.ntp.org"
                v-model="form.ntpAddress"
                class="w-full"
              />
            </div>
            <!-- Primary DNS -->
            <div>
              <InputTransparent
                label="Primary DNS"
                placeholder="e.g. 8.8.8.8"
                v-model="form.primaryDns"
                class="w-full"
              />
            </div>
            <!-- Secondary DNS -->
            <div>
              <InputTransparent
                label="Secondary DNS"
                placeholder="e.g. 8.8.4.4"
                v-model="form.secondaryDns"
                class="w-full"
              />
            </div>
            <!-- DHCP Active -->
            <div class="flex items-center space-x-3 mt-2">
              <label class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">DHCP active?</label>
              <label class="inline-flex items-center cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  v-model="form.dhcpActive"
                />
                <div
                  :class="[
                    'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                    form.dhcpActive ? 'boolean-selector-active' : 'boolean-selector-inactive'
                  ]"
                  style="border: 0px solid var(--toggle-border);"
                ></div>
              </label>
            </div>
            <!-- NTP Active -->
            <div class="flex items-center space-x-3 mt-2">
              <label class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">NTP active?</label>
              <label class="inline-flex items-center cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  v-model="form.ntpActive"
                />
                <div
                  :class="[
                    'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                    form.ntpActive ? 'boolean-selector-active' : 'boolean-selector-inactive'
                  ]"
                  style="border: 0px solid var(--toggle-border);"
                ></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row items-center justify-end gap-4 mt-8 mb-4 px-8">
        <ButtonConfirmation
          :label="'Update'"
          :isLoading="isLoading"
          :showTick="showTick"
          @confirm="submit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/apiConfig.js';
import InputTransparent from '../inputs/InputTransparent.vue';
import ButtonConfirmation from '../Modals/ButtonConfirmation.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'close', 'submit', 'response']);

const isLoading = ref(false);
const showTick = ref(false);

const form = reactive({
  dhcpActive: props.modelValue.dhcpActive ?? false,
  ntpActive: props.modelValue.ntpActive ?? false,
  ipv4: props.modelValue.ipv4 || '',
  netmask: props.modelValue.netmask || '',
  gateway: props.modelValue.gateway || '',
  ntpAddress: props.modelValue.ntpAddress || '',
  primaryDns: props.modelValue.primaryDns || '',
  secondaryDns: props.modelValue.secondaryDns || ''
});

function submit() {
  isLoading.value = true;
  showTick.value = false;
  
  const token = localStorage.getItem('jwt');
  
  const requestData = {
    IPAddress: form.ipv4,
    SubnetMask: form.netmask,
    DefaultGateway: form.gateway,
    NtpAddress: form.ntpAddress,
    NtpActive: form.ntpActive,
    IsDhcpEnabled: form.dhcpActive,
    PrimaryDns: form.primaryDns,
    SecondaryDns: form.secondaryDns
  };
  
  // Call the API to save network configuration
  axios.put(`${API_BASE_URL}/configuration/network`, requestData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(response => {
      console.log('Network configuration saved successfully:', response.data);
      
      // Check if the response indicates success
      if (response.data.success) {
        isLoading.value = false;
        showTick.value = true;
        
        // Emit response event for toast
        emit('response', { success: true, message: response.data.message || 'Network configuration updated successfully!' });
        
        // Reset button state after 2 seconds
        setTimeout(() => {
          showTick.value = false;
        }, 2000);
      } else {
        isLoading.value = false;
        showTick.value = false;
        console.error('Server responded with unsuccessful status');
        
        // Emit response event for toast
        emit('response', { success: false, message: 'Failed to update network configuration' });
      }
      
      emit('submit', { ...form });
    })
    .catch(error => {
      console.error('Failed to save network configuration:', error);
      isLoading.value = false;
      showTick.value = false;
      
      // Emit response event for toast
      emit('response', { success: false, message: error.response?.data?.message || 'Failed to update network configuration' });
      
      // You might want to show an error toast or message here
      // For now, still emit the submit event
      emit('submit', { ...form });
    });
}
</script>

<style scoped>

.input-border-color {
  border-color: #4e4e4e;
}
.boolean-selector-active {
  background-color: rgb(36, 132, 55);
}
.boolean-selector-inactive {
  background-color: #414040;
}
</style>
