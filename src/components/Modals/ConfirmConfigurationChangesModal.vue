<template>
  <transition name="fade-slide">
    <div
      v-if="show"
      class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-neutral-950/35 backdrop-blur-md shadow-xl"
      style="pointer-events: auto"
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow-sm bg-modal-color border border-color">
          <div class="p-4 md:p-5 text-left text-sm text-gray-800 dark:text-gray-200">
            <h3 class="text-lg font-bold mb-4">Confirm changes:</h3>
            <ul v-if="Object.keys(changes).length">
              <li v-for="(change, key) in changes" :key="key" class="mb-2">
                {{ key }}: {{ change.old }} -> <strong>{{ change.new }}</strong>
              </li>
            </ul>
            <p v-else class="text-gray-500">No differences found.</p>
            <div class="mt-6">
              <button
  type="button"
  :disabled="Object.keys(changes).length === 0"
  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
  @click="confirm"
>
  Confirm
</button>

            <button
              type="button"
              class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              @click="cancel"
            >
              Cancel
            </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits, ref } from "vue";
import axios from "axios";

const show = ref(false);
const objectA = ref({});
const objectB = ref({});

const emit = defineEmits(["onUpdatedData"]);
const props = defineProps({});

const changes = ref({});

function computeDiff(obj1, obj2) {
  const diffs = {};

  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  for (const key of keys) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    // If both are objects, compare their keys shallowly
    if (isPlainObject(val1) && isPlainObject(val2)) {
      const subkeys = new Set([...Object.keys(val1), ...Object.keys(val2)]);
      for (const subkey of subkeys) {
        if (val1[subkey] !== val2[subkey]) {
          diffs[`${key}.${subkey}`] = {
            old: val1[subkey] ?? "N/A",
            new: val2[subkey] ?? "N/A",
          };
        }
      }
    } else if (val1 !== val2) {
      diffs[key] = {
        old: val1 ?? "N/A",
        new: val2 ?? "N/A",
      };
    }
  }

  return diffs;
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function showDiff(obj1, obj2, type = 'opt') {
  objectA.value = obj1;
  objectB.value = obj2;
  changes.value = computeDiff(obj1, obj2);
  show.value = true;
  showDiff.type = type;
}

function confirm() {
  let url = 'http://localhost:5087/configuration/opt';
  if (showDiff.type === 'ui') {
    url = 'http://localhost:5087/configuration/ui';
  }
  const token = localStorage.getItem('jwt');
  axios
    .put(url, objectB.value, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
    })
    .then((response) => {
      show.value = false;
      emit("onUpdatedData", response.data);
      console.log("Configuration updated:", response.data);
    })
    .catch((error) => {
      console.error("Error updating configuration:", error);
      if (error.response && error.response.status === 404) {
        console.error("Configuration not found");
      }
    });
}

function cancel() {
  show.value = false;
}
defineExpose({
  showDiff,
});
</script>
<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal {
  /* Basic modal styling */
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
</style>
