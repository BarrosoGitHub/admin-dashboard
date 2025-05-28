<template>
  <!-- Main modal -->
  <transition name="fade-slide">
    <div
      v-if="show"
      :inert="!show"
      id="authentication-modal"
      tabindex="-1"
      class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-neutral-950/35 backdrop-blur-md"
      style="pointer-events: auto"
    >
      <div class="relative p-4 w-full max-w-2xl max-h-full min-h-[500px] min-w-[800px] flex items-center justify-center">
        <!-- Modal content -->
        <div class="relative bg-modal-color rounded-lg shadow-sm dark:bg-gray-700 w-full">
          <!-- Modal header -->
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ formatLabel(filteredGroupLabels[currentPage]) }}
            </h3>
          </div>
          <!-- Modal body -->
          <div class="p-4 md:p-5 flex-1 overflow-auto">
            <form class="space-y-4 h-full" @submit.prevent="submitForm">
              <div v-if="filteredGroupLabels.length">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Non-boolean fields first -->
                  <div
                    v-for="(value, prop) in nonBooleanFields(fields[filteredGroupLabels[currentPage]])"
                    :key="prop"
                    class="mb-2 dark:text-white"
                  >
                    <label
                      :for="`${filteredGroupLabels[currentPage]}-${prop}`"
                      class="block mb-2 text-sm font-medium dark:text-white"
                    >
                      {{ formatLabel(prop) }}
                    </label>
                    <div class="shadow-sm rounded-full">
                      <!-- Use select if enum options exist -->
                      <select
                        v-if="getEnumOptions(filteredGroupLabels[currentPage], prop)"
                        :id="`${filteredGroupLabels[currentPage]}-${prop}`"
                        v-model="fields[filteredGroupLabels[currentPage]][prop]"
                        class="bg-input-color text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white shadow-sm"
                      >
                        <!-- Show selected option first -->
                        <option
                          v-if="getEnumOptions(filteredGroupLabels[currentPage], prop).find(o => o.value === fields[filteredGroupLabels[currentPage]][prop])"
                          :value="fields[filteredGroupLabels[currentPage]][prop]"
                        >
                          {{
                            getEnumOptions(filteredGroupLabels[currentPage], prop).find(o => o.value === fields[filteredGroupLabels[currentPage]][prop])?.label
                          }}
                        </option>
                        <!-- Separator if there are other options -->
                        <option disabled v-if="getEnumOptions(filteredGroupLabels[currentPage], prop).length > 1">──────────</option>
                        <!-- Show remaining options (not selected) -->
                        <option
                          v-for="option in getEnumOptions(filteredGroupLabels[currentPage], prop).filter(o => o.value !== fields[filteredGroupLabels[currentPage]][prop])"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                      <!-- Otherwise, fallback to text input -->
                      <input
                        v-else
                        :id="`${filteredGroupLabels[currentPage]}-${prop}`"
                        v-model="fields[filteredGroupLabels[currentPage]][prop]"
                        type="text"
                        class="bg-input-color text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white shadow-xl"
                      />
                    </div>
                  </div>
                  <!-- Separator line before booleans -->
                  <div class="col-span-full">
                    <hr class="my-4 border-gray-300 dark:border-gray-600" />
                  </div>
                  <!-- Boolean fields at the end -->
                  <div
                    v-for="(value, prop) in booleanFields(fields[filteredGroupLabels[currentPage]])"
                    :key="prop"
                    class="mb-2 dark:text-white"
                  >
                    <label class="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        :id="`${filteredGroupLabels[currentPage]}-${prop}`"
                        v-model="fields[filteredGroupLabels[currentPage]][prop]"
                      />
                      <div
                        :class="[
                          'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                          fields[filteredGroupLabels[currentPage]][prop]
                            ? 'boolean-selector-active'
                            : 'boolean-selector-inactive'
                        ]"
                        style="border: 0px solid var(--toggle-border);"
                      ></div>
                      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ formatLabel(prop) }}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="flex justify-between mt-4" v-if="filteredGroupLabels.length > 1">
                <button
                  type="button"
                  @click="prevPage"
                  :disabled="currentPage === 0"
                  class="px-4 py-2 rounded bg-button-active-color"
                >Previous</button>
                <button
                  type="button"
                  @click="nextPage"
                  :disabled="currentPage === filteredGroupLabels.length - 1"
                  class="px-4 py-2 rounded bg-button-active-color"
                >Next</button>
              </div>
              <button
                v-if="currentPage === filteredGroupLabels.length - 1"
                type="submit"
                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-4"
              >
                Add OPT Configuration
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch, ref, computed } from 'vue';
// Import getEnumOptions from your enums helper
import enumOptions, { getEnumOptions as getEnumOptionsHelper } from '../../enums/enumOptions.js';

const getEnumOptions = getEnumOptionsHelper;

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({
      "User Info": {
        "Name": "",
        "Email": ""
      },
      "Settings": {
        "Theme": "Light",
        "Notifications": true
      }
    })
  }
});

const emit = defineEmits(['close', 'submit']);

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const fields = reactive(clone(props.data));
const currentPage = ref(0);

const filteredGroupLabels = computed(() =>
  Object.keys(fields).filter(
    key => fields[key] && typeof fields[key] === 'object' && Object.keys(fields[key]).length > 0
  )
);

function nonBooleanFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v !== 'boolean'));
}
function booleanFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v === 'boolean'));
}

watch(
  () => props.data,
  (newVal) => {
    Object.assign(fields, clone(newVal));
    currentPage.value = 0;
  },
  { deep: true }
);

function nextPage() {
  if (currentPage.value < filteredGroupLabels.value.length - 1) {
    currentPage.value++;
  }
}
function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
}

function submitForm() {
  emit('submit', clone(fields));
}

function formatLabel(label) {
  if (!label || typeof label !== 'string') return '';
  return label
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}
</script>
