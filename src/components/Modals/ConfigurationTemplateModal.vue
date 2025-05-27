<template>
  <!-- Main modal -->
  <div
    id="authentication-modal"
    tabindex="-1"
    aria-hidden="true"
    :class=" [
      show ? 'flex' : 'hidden',
      'overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'
    ]"
  >
    <div class="relative p-4 w-full max-w-2xl max-h-full min-h-[500px] min-w-[800px] flex items-center justify-center">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-full h-full flex flex-col">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Add configuration
          </h3>
          
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 flex-1 overflow-auto">
          <form class="space-y-4 h-full" @submit.prevent="submitForm">
            <div v-if="filteredGroupLabels.length">
              <h4 class="font-bold mb-2 dark:text-white">{{ filteredGroupLabels[currentPage] }}</h4>
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
                    >{{ prop }}</label
                  >
                  <div class="shadow-md rounded-full">
                    <input
                      :id="`${filteredGroupLabels[currentPage]}-${prop}`"
                      v-model="fields[filteredGroupLabels[currentPage]][prop]"
                      type="text"
                      class="bg-gray-500 text-white text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
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
                      class="relative w-11 h-6 bg-gray-700 rounded-full dark:bg-gray-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
                    ></div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ prop }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="flex justify-between mt-4" v-if="filteredGroupLabels.length > 1">
              <button type="button" @click="prevPage" :disabled="currentPage === 0" class="px-4 py-2 rounded bg-gray-300">Previous</button>
              <button type="button" @click="nextPage" :disabled="currentPage === filteredGroupLabels.length - 1" class="px-4 py-2 rounded bg-gray-300">Next</button>
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
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch, ref, computed } from 'vue';

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

// Deep clone to avoid mutating the prop directly
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const fields = reactive(clone(props.data));
const currentPage = ref(0);

// Only include non-null, non-undefined, and object group roots
const filteredGroupLabels = computed(() =>
  Object.keys(fields).filter(
    key => fields[key] && typeof fields[key] === 'object' && Object.keys(fields[key]).length > 0
  )
);

// Helpers to split fields
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
</script>
