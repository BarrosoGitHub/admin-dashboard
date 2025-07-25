<template>
  <transition name="fade-slide">
    <div
      v-if="show"
      class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-neutral-950/35 backdrop-blur-md shadow-xl"
      style="pointer-events: auto"
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow-sm bg-modal-color border border-color">
          <button
            type="button"
            class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl font-bold focus:outline-none"
            @click="cancel"
            :disabled="isLoading"
            aria-label="Close"
          >
            &times;
          </button>
          <div class="p-4 md:p-5 text-left text-sm text-gray-800 dark:text-gray-200">
            <h3 class="text-lg font-bold mb-4">Confirm changes:</h3>
            <ul v-if="Object.keys(changes).length">
              <li v-for="(change, key) in changes" :key="key" class="mb-2">
                {{ key }}: {{ change.old }} -> <strong>{{ change.new }}</strong>
              </li>
            </ul>
            <p v-else class="text-gray-500">No differences found.</p>
            <div class="mt-6 flex flex-row justify-end">
              <ButtonConfirmation
                :label="'Confirm'"
                :isLoading="isLoading"
                :showTick="showTick"
                :disabled="Object.keys(changes).length === 0"
                @confirm="confirm"
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </transition>
  <ConfirmationToast ref="confirmationToast" />
</template>

<script setup>
import { defineEmits, ref } from "vue";
import axios from "axios";
import { API_BASE_URL } from '@/apiConfig.js';
import ButtonConfirmation from './ButtonConfirmation.vue';
import ConfirmationToast from '../toasts/ConfirmationToast.vue';

const show = ref(false);
const objectA = ref({});
const objectB = ref({});

const emit = defineEmits(["onUpdatedData"]);
const props = defineProps({});

const changes = ref({});
const isLoading = ref(false);
const showTick = ref(false);
const confirmationToast = ref(null);

function computeDiff(obj1, obj2) {
  const diffs = {};

  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  for (const key of keys) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (Array.isArray(val1) && Array.isArray(val2)) {
      // Handle arrays by comparing each element
      if (val1.length !== val2.length) {
        diffs[key] = {
          old: `Array(${val1.length} items)`,
          new: `Array(${val2.length} items)`,
        };
      } else {
        // Compare each array element
        for (let i = 0; i < val1.length; i++) {
          const item1 = val1[i];
          const item2 = val2[i];
          
          if (isPlainObject(item1) && isPlainObject(item2)) {
            // Compare properties within array objects
            const itemKeys = new Set([...Object.keys(item1), ...Object.keys(item2)]);
            for (const itemKey of itemKeys) {
              const subVal1 = item1[itemKey];
              const subVal2 = item2[itemKey];
              
              // Handle arrays within objects (like AllowedAcquirerIds)
              if (Array.isArray(subVal1) && Array.isArray(subVal2)) {
                if (!arraysEqual(subVal1, subVal2)) {
                  diffs[`${key}[${i}].${itemKey}`] = {
                    old: JSON.stringify(subVal1),
                    new: JSON.stringify(subVal2),
                  };
                }
              } else if (subVal1 !== subVal2) {
                diffs[`${key}[${i}].${itemKey}`] = {
                  old: subVal1 ?? "N/A",
                  new: subVal2 ?? "N/A",
                };
              }
            }
          } else if (Array.isArray(item1) && Array.isArray(item2)) {
            if (!arraysEqual(item1, item2)) {
              diffs[`${key}[${i}]`] = {
                old: JSON.stringify(item1),
                new: JSON.stringify(item2),
              };
            }
          } else if (item1 !== item2) {
            diffs[`${key}[${i}]`] = {
              old: item1 ?? "N/A",
              new: item2 ?? "N/A",
            };
          }
        }
      }
    } else if (Array.isArray(val1) || Array.isArray(val2)) {
      // One is array, other is not
      diffs[key] = {
        old: Array.isArray(val1) ? `Array(${val1.length} items)` : val1 ?? "N/A",
        new: Array.isArray(val2) ? `Array(${val2.length} items)` : val2 ?? "N/A",
      };
    } else if (isPlainObject(val1) && isPlainObject(val2)) {
      const subkeys = new Set([...Object.keys(val1), ...Object.keys(val2)]);
      for (const subkey of subkeys) {
        const subVal1 = val1[subkey];
        const subVal2 = val2[subkey];
        
        // Handle arrays within objects
        if (Array.isArray(subVal1) && Array.isArray(subVal2)) {
          if (!arraysEqual(subVal1, subVal2)) {
            diffs[`${key}.${subkey}`] = {
              old: JSON.stringify(subVal1),
              new: JSON.stringify(subVal2),
            };
          }
        } else if (subVal1 !== subVal2) {
          diffs[`${key}.${subkey}`] = {
            old: subVal1 ?? "N/A",
            new: subVal2 ?? "N/A",
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

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
      if (!arraysEqual(arr1[i], arr2[i])) return false;
    } else if (isPlainObject(arr1[i]) && isPlainObject(arr2[i])) {
      if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) return false;
    } else if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
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
  isLoading.value = false;
  showTick.value = false;
}

async function confirm() {
  isLoading.value = true;
  showTick.value = false;

  const token = localStorage.getItem('jwt');

  let url = `${API_BASE_URL}/opt-configuration`;
  if (showDiff.type === 'ui') {
    url = `${API_BASE_URL}/configuration/ui`;
  } else if (showDiff.type === 'eps') {
    url = `${API_BASE_URL}/eps-configuration`;
  }

  try {
    const response = await axios.put(url, objectB.value, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
    });
    showTick.value = true;
    isLoading.value = false;
    emit("onUpdatedData", response.data);
    
    // Show success toast
    confirmationToast.value?.showConfirmationToast("Configuration updated successfully!", true);
    
    setTimeout(() => {
      show.value = false;
      showTick.value = false;
    }, 900);
    console.log("Configuration updated:", response.data);
  } catch (error) {
    isLoading.value = false;
    showTick.value = false;
    
    // Show error toast
    confirmationToast.value?.showConfirmationToast("Failed to update configuration", false);
    
    console.error("Error updating configuration:", error);
    if (error.response && error.response.status === 404) {
      console.error("Configuration not found");
    }
  }
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

@keyframes tick {
  0% {
    opacity: 0;
    transform: scale(0.7) rotate(-10deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.1) rotate(8deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
.animate-tick {
  animation: tick 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes tick-draw {
  0% {
    stroke-dashoffset: 24;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
.tick-animate {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: tick-draw 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
