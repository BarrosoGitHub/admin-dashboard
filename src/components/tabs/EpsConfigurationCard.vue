<script setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";
import InputTransparent from "../inputs/InputTransparent.vue";
import enumOptions, {
  getEnumOptions as getEnumOptionsHelper,
} from "../../enums/enumOptions.js";
import {
  CreditCardIcon,
  Cog6ToothIcon,
  DeviceTabletIcon,
  PrinterIcon,
  QrCodeIcon,
  GlobeAltIcon,
  CurrencyEuroIcon,
  ClockIcon,
  UserGroupIcon,
  TagIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  ServerStackIcon,
  IdentificationIcon,
  ListBulletIcon,
} from '@heroicons/vue/24/outline'

const getEnumOptions = getEnumOptionsHelper;

const props = defineProps({
  show: Boolean,
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  searchValue: {
    type: String,
    default: '',
  },
});

const localData = ref(JSON.parse(JSON.stringify(props.data)));

// Transform the data structure to group properties
const transformedData = computed(() => {
  const general = {};
  const lists = {};
  
  for (const [key, value] of Object.entries(localData.value)) {
    if (Array.isArray(value)) {
      lists[key] = value;
    } else {
      general[key] = value;
    }
  }
  
  const result = {};
  if (Object.keys(general).length > 0) {
    result.General = general;
  }
  
  // Add list properties as separate tabs
  Object.assign(result, lists);
  
  return result;
});

const activeTab = ref("General");

const emit = defineEmits(["update"]);

watch(
  () => props.data,
  (newData) => {
    localData.value = JSON.parse(JSON.stringify(newData));
    const keys = Object.keys(transformedData.value);
    if (!keys.includes(activeTab.value)) {
      activeTab.value = keys.length ? keys[0] : "General";
    }
  }
);

const filteredData = computed(() => {
  if (!props.searchValue.trim()) return transformedData.value;
  const result = {};
  const search = props.searchValue.toLowerCase();
  
  for (const [section, fields] of Object.entries(transformedData.value)) {
    if (section.toLowerCase().includes(search)) {
      result[section] = fields;
      continue;
    }
    
    if (Array.isArray(fields)) {
      // For list properties, search within the array items
      const filteredItems = fields.filter(item => {
        if (typeof item === 'object' && item !== null) {
          return Object.entries(item).some(([key, value]) =>
            key.toLowerCase().includes(search) ||
            String(value).toLowerCase().includes(search)
          );
        }
        return String(item).toLowerCase().includes(search);
      });
      if (filteredItems.length > 0) {
        result[section] = filteredItems;
      }
    } else if (typeof fields === "object" && fields !== null) {
      // For general properties
      const filteredFields = Object.fromEntries(
        Object.entries(fields).filter(
          ([key, value]) =>
            key.toLowerCase().includes(search) ||
            String(value).toLowerCase().includes(search)
        )
      );
      if (Object.keys(filteredFields).length) {
        result[section] = filteredFields;
      }
    }
  }
  return result;
});

watch(filteredData, (newFiltered) => {
  const keys = Object.keys(newFiltered);
  if (!keys.includes(activeTab.value)) {
    activeTab.value = keys.length ? keys[0] : "";
  }
});

function updateConfiguration() {
  // Reconstruct the original structure from transformedData
  const reconstructed = {};
  
  for (const [section, fields] of Object.entries(transformedData.value)) {
    if (section === 'General') {
      // Add general properties directly to the root
      Object.assign(reconstructed, fields);
    } else {
      // Add list properties as they are
      reconstructed[section] = fields;
    }
  }
  
  emit("update", {
    config: reconstructed,
  });
}

function formatLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
}

const iconMap = {
  General: Cog6ToothIcon,
  RegisteredTerminals: DeviceTabletIcon,
  Acquirers: CreditCardIcon,
  Languages: GlobeAltIcon,
  Messages: QrCodeIcon,
  EpsClientConfiguration: QrCodeIcon,
  PinpadConfiguration: CreditCardIcon,
  FdcConfiguration: Cog6ToothIcon,
  DisplayConfiguration: DeviceTabletIcon,
  PrinterConfiguration: PrinterIcon,
  ViaVerdeConfiguration: GlobeAltIcon,
  RemoteServicesConfiguration: ServerStackIcon,
  GalpConfiguration: CurrencyEuroIcon,
  RegionalSettings: GlobeAltIcon,
  BnaConfiguration: BanknotesIcon,
  HeadOfficeConfiguration: BuildingStorefrontIcon,
  TimingsConfiguration: ClockIcon,
  LocalCreditConfiguration: UserGroupIcon,
  BankingCardPaymentConfiguration: CreditCardIcon,
  DiscountsConfiguration: TagIcon,
  PrioConfiguration: IdentificationIcon,
  IngenicoConfiguration: CreditCardIcon,
  IntermarcheConfiguration: BuildingStorefrontIcon,
  BongasConfiguration: GlobeAltIcon,
}

function nonBooleanFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v !== 'boolean'));
}
function booleanFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v === 'boolean'));
}
</script>

<template>
  <div v-if="props.show" class="py-9 px-8 ">
    <div class="w-full min-w-[320px] max-w-full  md:min-w-[950px] md:max-w-[70vw] rounded-2xl shadow-md bg-modal-color border border-color flex flex-col" style="z-index: 10; position: relative;">
      <!-- Top line with label -->
      <div class="w-full flex items-center border-b border-color px-7 py-4 mb-2">
      <span class="inline-block align-middle px-2.5">
                <img src="@/assets/payment.png" alt="Payment icon" width="32" height="32" class="inline-block align-middle mr-1 payment-icon" />
                <span class="sr-only">Payment icon</span>
              </span>
        <span class="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">EPS Configuration</span>
      </div>
      
      <div class="flex flex-1 min-h-0">
        <!-- Tabs on the left -->
        <ul
          class="flex flex-col w-63 text-sm font-medium text-left text-white-900 dark:text-white-900 py-2 px-4"
          role="tablist"
        >
          <li v-for="key in Object.keys(filteredData)" :key="key" class="flex">
            <button
              type="button"
              class="tab-animate flex items-center flex-1 text-left px-2 py-1.5 my-1.5 mx-3 cursor-pointer"
              :class="[activeTab === key
                ? 'active text-color font-semibold'
                : 'text-color-secondary']"
              @click="activeTab = key"
              style="position:relative;"
            >
              <component
                :is="iconMap[key] || Cog6ToothIcon"
                class="w-5 h-5 mr-2"
              />
              {{
                formatLabel(key)
                  .replace(/configuration/i, "")
                  .trim()
              }}
              <span class="tab-border"></span>
            </button>
          </li>
        </ul>
        <!-- Content on the right -->
        <div class="flex-1 min-h-0 table flex-col">
          <div
            v-if="activeTab && filteredData[activeTab]"
            :key="activeTab + props.searchValue"
            class="rounded-xl md:pr-15 md:pl-5 flex-1 overflow-y-auto"
          >
            <h2
              class="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
            </h2>
            
            <!-- General tab - show properties as form fields -->
            <template v-if="activeTab === 'General' && !Array.isArray(filteredData[activeTab])">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-15 gap-y-2">
                <!-- Non-boolean fields first -->
                <template
                  v-for="(propValue, propKey) in nonBooleanFields(filteredData[activeTab])"
                  :key="propKey"
                >
                  <InputTransparent
                    :label="formatLabel(propKey)"
                    :placeholder="String(propValue)"
                    v-model="transformedData.General[propKey]"
                    :type="getEnumOptions(activeTab, propKey) ? 'select' : 'text'"
                    :options="getEnumOptions(activeTab, propKey) || undefined"
                    class="w-full m-1"
                  />
                </template>
                <!-- Separator line before booleans, only if there are boolean fields -->
                <template v-if="Object.keys(booleanFields(filteredData[activeTab])).length">
                  <div class="my-6 col-span-full">
                    <hr class="my-4 border border-color hidden" />
                  </div>
                </template>
                <!-- Boolean fields at the end, with slider (no icon) -->
                <template
                  v-for="(propValue, propKey) in booleanFields(filteredData[activeTab])"
                  :key="propKey"
                >
                  <div class="flex items-center space-x-3 mx-3 ">
                    <label :for="`${activeTab}-${propKey}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">{{
                      formatLabel(propKey)
                    }}</label>
                    <!-- Slider toggle switch -->
                    <label class="inline-flex items-center cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        :id="`${activeTab}-${propKey}`"
                        v-model="transformedData.General[propKey]"
                      />
                      <div
                        :class=" [
                          'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                          transformedData.General[propKey]
                            ? 'boolean-selector-active'
                            : 'boolean-selector-inactive'
                        ]"
                        style="border: 0px solid var(--toggle-border);"
                      ></div>
                    </label>
                  </div>
                </template>
              </div>
            </template>
            
            <!-- List tabs - show array items -->
            <template v-else-if="Array.isArray(filteredData[activeTab])">
              <div class="space-y-4">
                <div v-if="filteredData[activeTab].length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8">
                  No {{ formatLabel(activeTab).toLowerCase() }} configured
                </div>
                <div 
                  v-for="(item, index) in filteredData[activeTab]" 
                  :key="index"
                  class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                >
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {{ formatLabel(activeTab).slice(0, -1) }} {{ index + 1 }}
                  </h3>
                  <div v-if="typeof item === 'object' && item !== null" class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <!-- Non-boolean fields first -->
                    <template
                      v-for="(propValue, propKey) in nonBooleanFields(item)"
                      :key="propKey"
                    >
                      <InputTransparent
                        :label="formatLabel(propKey)"
                        :placeholder="String(propValue)"
                        v-model="transformedData[activeTab][index][propKey]"
                        :type="getEnumOptions(activeTab, propKey) ? 'select' : 'text'"
                        :options="getEnumOptions(activeTab, propKey) || undefined"
                        class="w-full m-1"
                      />
                    </template>
                    <!-- Boolean fields -->
                    <template
                      v-for="(propValue, propKey) in booleanFields(item)"
                      :key="propKey"
                    >
                      <div class="flex items-center space-x-3 mx-3">
                        <label :for="`${activeTab}-${index}-${propKey}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">{{
                          formatLabel(propKey)
                        }}</label>
                        <label class="inline-flex items-center cursor-pointer ml-auto">
                          <input
                            type="checkbox"
                            class="sr-only peer"
                            :id="`${activeTab}-${index}-${propKey}`"
                            v-model="transformedData[activeTab][index][propKey]"
                          />
                          <div
                            :class="[
                              'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                              transformedData[activeTab][index][propKey]
                                ? 'boolean-selector-active'
                                : 'boolean-selector-inactive'
                            ]"
                            style="border: 0px solid var(--toggle-border);"
                          ></div>
                        </label>
                      </div>
                    </template>
                  </div>
                  <div v-else class="text-gray-600 dark:text-gray-400">
                    {{ item }}
                  </div>
                </div>
              </div>
            </template>
            
            <div
              v-else-if="filteredData[activeTab] === null"
              class="text-gray-500 dark:text-gray-400"
            >
              No data
            </div>
          </div>
        </div>
      </div>
      <!-- Search and Button always at the bottom of the card -->
      <div class="flex flex-col md:flex-row items-center justify-end gap-4 mt-8 mb-4 px-8">
        <button
          @click="updateConfiguration"
          class="p-4 text-white bg-blue-600 focus:outline-none hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-full text-sm px-10 py-2.5 dark:bg-blue-700 dark:text-white dark:border-blue-600 dark:hover:bg-blue-800 dark:hover:border-blue-600 dark:focus:ring-blue-800"
        >
          Update Configuration
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-animate {
  position: relative;
  transition: color 0.2s;
}
.tab-animate .tab-border {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: var(--input-border-color-selected); /* use the selector color */
  border-radius: 2px;
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  pointer-events: none;
}
.tab-animate.active .tab-border {
  transform: scaleX(1);
}

/* Tint payment icon to white in dark mode */
.payment-icon {
  /* Default: no filter */
}
.dark .payment-icon {
  filter: brightness(0) invert(1);
}
</style>


