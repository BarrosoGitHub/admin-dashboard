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
import { defineEmits, ref, onMounted } from "vue";
import axios from "axios";
import { API_BASE_URL } from '@/apiConfig.js';
import { getApiBaseUrl } from "../../apiConfig.js";
import enumOptions, {
  getEnumOptions as getEnumOptionsHelper,
} from "../../enums/enumOptions.js";
import ButtonConfirmation from './ButtonConfirmation.vue';
import ConfirmationToast from '../toasts/ConfirmationToast.vue';

const show = ref(false);
const objectA = ref({});
const objectB = ref({});
const dynamicEnums = ref({});
const getEnumOptions = getEnumOptionsHelper;

const emit = defineEmits(["onUpdatedData"]);
const props = defineProps({});

const changes = ref({});
const isLoading = ref(false);
const showTick = ref(false);
const confirmationToast = ref(null);

// Fetch dynamic enums on component mount
onMounted(async () => {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const token = localStorage.getItem('jwt');
    
    // Try to fetch enums from both endpoints
    const [optEnumsResponse, epsEnumsResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/opt-configuration/enums`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }).catch(() => null),
      fetch(`${apiBaseUrl}/eps-configuration/enums`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }).catch(() => null)
    ]);
    
    const allEnums = {};
    
    if (optEnumsResponse && optEnumsResponse.ok) {
      const optEnums = await optEnumsResponse.json();
      Object.assign(allEnums, optEnums);
    }
    
    if (epsEnumsResponse && epsEnumsResponse.ok) {
      const epsEnums = await epsEnumsResponse.json();
      Object.assign(allEnums, epsEnums);
    }
    
    dynamicEnums.value = allEnums;
    console.log('Confirmation modal enums loaded:', allEnums);
  } catch (error) {
    console.error('Failed to fetch enums for confirmation modal:', error);
  }
});

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
          old: formatValueForDisplay(key, val1),
          new: formatValueForDisplay(key, val2),
        };
      } else {
        // Compare each array element
        for (let i = 0; i < val1.length; i++) {
          const item1 = val1[i];
          const item2 = val2[i];
          
          if (isPlainObject(item1) && isPlainObject(item2)) {
            // Check if the objects are actually different before comparing properties
            if (JSON.stringify(item1) !== JSON.stringify(item2)) {
              // Compare properties within array objects
              const itemKeys = new Set([...Object.keys(item1), ...Object.keys(item2)]);
              for (const itemKey of itemKeys) {
                const subVal1 = item1[itemKey];
                const subVal2 = item2[itemKey];
                const propertyPath = `${key}[${i}].${itemKey}`;
                
                // Handle nested objects (like RegisteredProducts)
                if (isPlainObject(subVal1) && isPlainObject(subVal2)) {
                  // Only add diff if the nested objects are actually different
                  if (JSON.stringify(subVal1) !== JSON.stringify(subVal2)) {
                    diffs[propertyPath] = {
                      old: JSON.stringify(subVal1),
                      new: JSON.stringify(subVal2),
                    };
                  }
                }
                // Handle arrays within objects (like AllowedAcquirerIds)
                else if (Array.isArray(subVal1) && Array.isArray(subVal2)) {
                  if (!arraysEqual(subVal1, subVal2)) {
                    diffs[propertyPath] = {
                      old: formatValueForDisplay(propertyPath, subVal1),
                      new: formatValueForDisplay(propertyPath, subVal2),
                    };
                  }
                } else if (subVal1 !== subVal2) {
                  diffs[propertyPath] = {
                    old: formatValueForDisplay(propertyPath, subVal1) ?? "N/A",
                    new: formatValueForDisplay(propertyPath, subVal2) ?? "N/A",
                  };
                }
              }
            }
          } else if (Array.isArray(item1) && Array.isArray(item2)) {
            if (!arraysEqual(item1, item2)) {
              const propertyPath = `${key}[${i}]`;
              diffs[propertyPath] = {
                old: formatValueForDisplay(propertyPath, item1),
                new: formatValueForDisplay(propertyPath, item2),
              };
            }
          } else if (item1 !== item2) {
            const propertyPath = `${key}[${i}]`;
            diffs[propertyPath] = {
              old: formatValueForDisplay(propertyPath, item1) ?? "N/A",
              new: formatValueForDisplay(propertyPath, item2) ?? "N/A",
            };
          }
        }
      }
    } else if (Array.isArray(val1) || Array.isArray(val2)) {
      // One is array, other is not
      diffs[key] = {
        old: formatValueForDisplay(key, val1) ?? "N/A",
        new: formatValueForDisplay(key, val2) ?? "N/A",
      };
    } else if (isPlainObject(val1) && isPlainObject(val2)) {
      // Check if objects are actually different before diving into properties
      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        const subkeys = new Set([...Object.keys(val1), ...Object.keys(val2)]);
        for (const subkey of subkeys) {
          const subVal1 = val1[subkey];
          const subVal2 = val2[subkey];
          const propertyPath = `${key}.${subkey}`;
          
          // Handle arrays within objects
          if (Array.isArray(subVal1) && Array.isArray(subVal2)) {
            if (!arraysEqual(subVal1, subVal2)) {
              diffs[propertyPath] = {
                old: formatValueForDisplay(propertyPath, subVal1),
                new: formatValueForDisplay(propertyPath, subVal2),
              };
            }
          } else if (subVal1 !== subVal2) {
            diffs[propertyPath] = {
              old: formatValueForDisplay(propertyPath, subVal1) ?? "N/A",
              new: formatValueForDisplay(propertyPath, subVal2) ?? "N/A",
            };
          }
        }
      }
    } else if (val1 !== val2) {
      diffs[key] = {
        old: formatValueForDisplay(key, val1) ?? "N/A",
        new: formatValueForDisplay(key, val2) ?? "N/A",
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

// Helper function to format enum options into the expected format
function formatEnumOptions(enumData) {
  if (!enumData) return null;
  
  // If it's already in the correct format { value, label }[]
  if (Array.isArray(enumData) && enumData.length > 0 && typeof enumData[0] === 'object' && 'value' in enumData[0] && 'label' in enumData[0]) {
    return enumData;
  }
  
  // Handle API format with { Value, Name } properties (from backend)
  if (Array.isArray(enumData) && enumData.length > 0 && typeof enumData[0] === 'object' && 'Value' in enumData[0] && 'Name' in enumData[0]) {
    return enumData.map(item => ({ 
      value: item.Value, 
      label: item.Name 
    }));
  }
  
  // If it's an array of strings, convert to { value, label } format
  if (Array.isArray(enumData) && enumData.length > 0 && typeof enumData[0] === 'string') {
    return enumData.map((item, index) => ({ value: index, label: item }));
  }
  
  // If it's an object with key-value pairs, convert to { value, label } format
  if (typeof enumData === 'object' && !Array.isArray(enumData)) {
    return Object.entries(enumData).map(([key, value]) => ({ 
      value: isNaN(Number(key)) ? key : Number(key), 
      label: String(value) 
    }));
  }
  
  return null;
}

// Enhanced function to get enum options for a property
function getEnumOptionsForProperty(tab, prop) {
  // First try dynamic enums
  if (dynamicEnums.value) {
    // Check if there's a direct match for the property
    if (dynamicEnums.value[prop]) {
      return formatEnumOptions(dynamicEnums.value[prop]);
    }
    
    // Check if there's a tab-specific enum
    if (dynamicEnums.value[tab] && dynamicEnums.value[tab][prop]) {
      return formatEnumOptions(dynamicEnums.value[tab][prop]);
    }
    
    // Check with case-insensitive matching
    const tabKey = Object.keys(dynamicEnums.value).find(
      k => k.toLowerCase() === tab.toLowerCase()
    );
    if (tabKey && typeof dynamicEnums.value[tabKey] === "object" && dynamicEnums.value[tabKey][prop]) {
      return formatEnumOptions(dynamicEnums.value[tabKey][prop]);
    }
    
    // Check for partial property name matches
    const enumKey = Object.keys(dynamicEnums.value).find(key => {
      // Try exact match first
      if (key === prop) return true;
      
      // Try case-insensitive match
      if (key.toLowerCase() === prop.toLowerCase()) return true;
      
      // Try partial matches for common patterns
      const keyLower = key.toLowerCase();
      const propLower = prop.toLowerCase();
      
      // Check if property name contains the enum key or vice versa
      if (keyLower.includes(propLower) || propLower.includes(keyLower)) return true;
      
      // Check for common suffixes/prefixes
      if (keyLower.endsWith('type') && propLower.includes('type')) return true;
      if (keyLower.endsWith('mode') && propLower.includes('mode')) return true;
      if (keyLower.endsWith('language') && propLower.includes('language')) return true;
      if (keyLower.endsWith('identifier') && propLower.includes('identifier')) return true;
      
      return false;
    });
    
    if (enumKey) {
      return formatEnumOptions(dynamicEnums.value[enumKey]);
    }
  }
  
  // Fallback to static enums
  return getEnumOptions(tab, prop);
}

// Function to get the enum label for a value
function getEnumLabel(propertyPath, value) {
  if (value === null || value === undefined) return value;
  
  // Extract tab and property from path like "General.DefaultLanguage" or just "DefaultLanguage"
  const pathParts = propertyPath.split('.');
  const prop = pathParts[pathParts.length - 1]; // Get the last part as property name
  const tab = pathParts.length > 1 ? pathParts[pathParts.length - 2] : 'General'; // Get second to last as tab
  
  const enumOptions = getEnumOptionsForProperty(tab, prop);
  if (enumOptions) {
    const option = enumOptions.find(opt => opt.value == value); // Use == for loose comparison
    if (option) {
      return option.label; // Just return the label without the value
    }
  }
  
  return value;
}

// Function to format a value for display (with enum label if applicable)
function formatValueForDisplay(propertyPath, value) {
  if (Array.isArray(value)) {
    return `Array(${value.length} items)`;
  }
  
  return getEnumLabel(propertyPath, value);
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
