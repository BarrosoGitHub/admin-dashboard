<template>
  <transition name="fade-slide">
    <div
      v-if="props.show"
      class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-neutral-900/35 backdrop-blur-md"
      style="pointer-events: auto"
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-modal-color rounded-2xl shadow-inner">
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-neutral-600 border-gray-200"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="inline-block align-middle">
                <img src="@/assets/petrol-pump.png" alt="Petrol Pump icon" width="32" height="32" class="inline-block align-middle mr-1 petrol-pump-icon" />
                <span class="sr-only">Petrol Pump icon</span>
              </span>
              New OPT configuration
            </h3>
            <button
              type="button"
              class="end-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              @click="emit('close')"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="p-4 md:p-5">
            <form class="space-y-4" @submit="submitForm">
              <div>
                <InputTransparent
                  v-model="form.stationId"
                  label="Station Id"
                  id="stationId"
                  required
                  placeholder="Enter StationId"
                />
              </div>
              <div>
                <InputTransparent
                  v-model="form.workstationId"
                  label="Workstation Id"
                  name="workstationId"
                  id="workstationId"
                  required
                  placeholder="Enter WorkstationId"
                />
              </div>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <InputTransparent
                    v-model="form.company"
                    :label="'Company'"
                    :placeholder="form.company || 'Select company'"
                    :type="'select'"
                    :options="['Generic', 'Galp', 'Prio', 'Intermarche', 'Bongas'].map(opt => ({ label: opt, value: opt }))"
                    class="w-full"
                    name="company"
                    id="company"
                    required
                  />
                </div>
                <div>
                  <InputTransparent
                    v-model="form.country"
                    :label="'Country'"
                    :placeholder="form.country || 'Select country'"
                    :type="'select'"
                    :options="['PT', 'ES', 'CA'].map(opt => ({ label: opt, value: opt }))"
                    class="w-full"
                    name="country"
                    id="country"
                    required
                  />
                </div>
              </div>
              <div>
                <div class="relative">
                  <InputTransparent
                    v-model="form.networkSegment"
                    label="Network Segment"
                    name="networkSegment"
                    id="networkSegment"
                    required
                    placeholder="Enter Network Segment"
                    @input="validateNetworkSegment"
                  />
                  <svg v-if="isNetworkSegmentValid" class="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="mt-10">
                <button
                  type="submit"
                  class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, reactive, ref, watch } from "vue";
import axios from "axios";
import { API_BASE_URL } from '@/apiConfig.js';
import InputTransparent from '../inputs/InputTransparent.vue';

const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(["close", "submitted"]);

const form = reactive({
  stationId: "",
  workstationId: "",
  networkSegment: "",
  company: "",
  country: "",
});

const isNetworkSegmentValid = ref(false);

function validateNetworkSegment() {
  // Simple IPv4 validation
  const value = form.networkSegment.trim();
  isNetworkSegmentValid.value = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value) && value.split('.').every(octet => Number(octet) >= 0 && Number(octet) <= 255);
}

watch(() => form.networkSegment, validateNetworkSegment);

async function submitForm(e) {
  e.preventDefault();
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.get(`${API_BASE_URL}/opt-configuration/template`, {
      params: { ...form },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    emit("submitted", response.data);
    emit("close");
    form.stationId = "";
    form.workstationId = "";
    form.networkSegment = "";
    form.company = "";
    form.country = "";
  } catch (err) {
    alert("Error submitting configuration");
    console.error(err);
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px); /* start lower */
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px); /* leave lower */
}

.dark .petrol-pump-icon {
  filter: brightness(0) invert(1);
}

</style>
