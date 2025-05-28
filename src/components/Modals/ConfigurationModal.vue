<template>
  <transition name="fade-slide">
    <div
      v-if="props.show"
      class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-neutral-700/35 backdrop-blur-md"
      style="pointer-events: auto"
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-modal-color rounded-lg shadow-sm">
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-neutral-600 border-gray-200"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Add new configuration
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
                <label
                  for="stationId"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >StationId</label
                >
                <!-- StationId input -->
                <input
                  v-model="form.stationId"
                  type="text"
                  name="stationId"
                  id="stationId"
                  class="text-gray-900 text-sm rounded-full block w-full p-2.5 bg-modal-color bg-input-color dark:border-neutral-500 dark:text-white shadow-md"
                  required
                />
              </div>
              <div>
                <label
                  for="workstationId"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >WorkstationId</label
                >
                <!-- WorkstationId input -->
                <input
                  v-model="form.workstationId"
                  type="text"
                  name="workstationId"
                  id="workstationId"
                  class="text-gray-900 text-sm rounded-full block w-full p-2.5 bg-input-color dark:bg-neutral-500 dark:border-neutral-500 dark:text-white shadow-md"
                  required
                />
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    for="company"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Company</label
                  >
                  <!-- Company select -->
                  <select
                    v-model="form.company"
                    name="company"
                    id="company"
                    class="text-gray-900 text-sm rounded-full block w-full p-2.5 bg-input-color dark:bg-neutral-500 dark:border-neutral-500 dark:text-white shadow-md"
                    required
                  >
                    <option value="">Select company</option>
                    <option value="Generic">Generic</option>
                    <option value="Galp">Galp</option>
                    <option value="Prio">Prio</option>
                    <option value="Intermarche">Intermarche</option>
                    <option value="Bongas">Bongas</option>
                  </select>
                </div>
                <div>
                  <label
                    for="country"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Country</label
                  >
                  <!-- Country select -->
                  <select
                    v-model="form.country"
                    name="country"
                    id="country"
                    class="text-gray-900 text-sm rounded-full block w-full p-2.5 bg-input-color dark:bg-neutral-500 dark:border-neutral-500 dark:text-white shadow-md"
                    required
                  >
                    <option value="">Select country</option>
                    <option value="PT">PT</option>
                    <option value="ES">ES</option>
                    <option value="CA">CA</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  for="networkSegment"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Network segment</label
                >
                <!-- Network Segment input -->
                <input
                  v-model="form.networkSegment"
                  type="text"
                  name="networkSegment"
                  id="networkSegment"
                  class="text-gray-900 text-sm rounded-full block w-full p-2.5 bg-input-color dark:bg-neutral-500 dark:border-neutral-500 dark:text-white shadow-md"
                  required
                />
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
import { defineProps, defineEmits, reactive, ref } from "vue";
import axios from "axios";

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

async function submitForm(e) {
  e.preventDefault();
  try {
    const response = await axios.get("http://localhost:5087/configuration/opt/template", {
      params: { ...form },
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

</style>
