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
  ChevronDownIcon,
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

// Group properties into general and list sections
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
  Object.assign(result, lists);
  return result;
});

const activeTab = ref("General");
const activeSubTab = ref(null);
// Collapsed state for array-based tabs
const collapsedTabs = ref(new Set());

const emit = defineEmits(["update"]);

// Update collapsed tabs when transformedData changes
watch(transformedData, (newData) => {
  const arrayTabs = Object.keys(newData).filter(key => Array.isArray(newData[key]));
  collapsedTabs.value = new Set(arrayTabs);
}, { immediate: true });

watch(
  () => props.data,
  (newData) => {
    localData.value = JSON.parse(JSON.stringify(newData));
    const keys = Object.keys(transformedData.value);
    if (!keys.includes(activeTab.value)) {
      activeTab.value = keys.length ? keys[0] : "General";
    }
    activeSubTab.value = null;
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
      // Search within array items
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
      // Search within general properties
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
    activeSubTab.value = null;
  }
});

function updateConfiguration() {
  emit("update", {
    config: localData.value,
  });
}

function formatLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
}

function toggleTabCollapse(tabKey) {
  const newCollapsed = new Set(collapsedTabs.value);
  if (newCollapsed.has(tabKey)) {
    newCollapsed.delete(tabKey);
  } else {
    newCollapsed.add(tabKey);
  }
  collapsedTabs.value = newCollapsed;
}

function selectMainTab(tabKey) {
  activeTab.value = tabKey;
  activeSubTab.value = null;
}

function selectSubTab(tabKey, index) {
  activeTab.value = tabKey;
  activeSubTab.value = index;
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
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v !== 'boolean' && !Array.isArray(v)));
}
function booleanFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v === 'boolean'));
}
function arrayFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => Array.isArray(v)));
}
</script>

<template>
  <div v-if="props.show" class="py-9 px-8 ">
    <div class="w-full min-w-[320px] max-w-full  md:min-w-[950px] md:max-w-[70vw] rounded-2xl shadow-md bg-modal-color border border-color flex flex-col" style="z-index: 10; position: relative;">
      <!-- Top line with label -->
      <div class="w-full flex items-center border-b border-color px-7 py-4 mb-2">
      <span class="inline-block align-middle px-2.5">
                <img src="@/assets/payment.png" alt="Payment icon" width="36" height="36" class="inline-block align-middle mr-1 payment-icon" />
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
          <li v-for="key in Object.keys(filteredData)" :key="key" class="flex flex-col">
            <!-- Main tab button -->
            <div class="tab-animate flex items-center flex-1 text-left px-2 py-1.5 my-1.5 mx-3 cursor-pointer"
              :class="[activeTab === key && activeSubTab === null ? 'active text-color font-semibold' : 'text-color-secondary']"
              style="position:relative;">
              <component
                :is="iconMap[key] || Cog6ToothIcon"
                class="w-5 h-5 mr-2"
              />
              <span
                class="flex-1"
                @click="selectMainTab(key)"
                style="user-select: none;"
              >
                {{
                  formatLabel(key)
                    .replace(/configuration/i, "")
                    .trim()
                }}
              </span>
              <!-- Chevron for collapsible tabs -->
              <ChevronDownIcon
                v-if="Array.isArray(filteredData[key])"
                class="w-4 h-4 ml-auto transition-transform duration-200"
                :class="{ 'rotate-180': !collapsedTabs.has(key) }"
                @click.stop="toggleTabCollapse(key)"
                style="cursor:pointer;"
              />
              <span class="tab-border"></span>
            </div>
            
            <!-- Sub-tabs for array items with smooth transition -->
            <transition name="subtab-fade" mode="out-in">
              <div
                v-if="Array.isArray(filteredData[key]) && !collapsedTabs.has(key)"
                class="ml-5 space-y-1 subtab-transition-wrapper"
                key="subtab-list"
              >
                <button
                  v-for="(item, index) in filteredData[key]"
                  :key="`${key}-${index}`"
                  type="button"
                  class="tab-animate flex items-center w-full text-left px-2 py-1 mx-3 cursor-pointer text-sm"
                  :class="[activeTab === key && activeSubTab === index
                    ? 'active text-color font-medium'
                    : 'text-color-secondary']"
                  @click="selectSubTab(key, index)"
                  style="position:relative;"
                >
                  <span class="w-2 h-2 rounded-full bg-current mr-2 opacity-50"></span>
                  {{ formatLabel(key).slice(0, -1) }} {{ index + 1 }}
                  <span class="tab-border"></span>
                </button>
              </div>
            </transition>
          </li>
        </ul>
        <!-- Content on the right -->
        <div class="flex-1 min-h-0 table flex-col">
          <div
            v-if="activeTab && filteredData[activeTab]"
            :key="activeTab + activeSubTab + props.searchValue"
            class="rounded-xl md:pr-15 md:pl-5 flex-1 overflow-y-auto"
          >
            <h2
              class="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
            </h2>
            
            <!-- General tab or main tab without sub-selection -->
            <template v-if="(activeTab === 'General' || !Array.isArray(filteredData[activeTab])) && activeSubTab === null">
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
            
            <!-- Single sub-tab item view -->
            <template v-else-if="Array.isArray(filteredData[activeTab]) && activeSubTab !== null">
              <div class="space-y-4">
                <div class="bg-white bg-modal-color p-4">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {{ formatLabel(activeTab).slice(0, -1) }} {{ activeSubTab + 1 }}
                  </h3>
                  <div v-if="typeof filteredData[activeTab][activeSubTab] === 'object' && filteredData[activeTab][activeSubTab] !== null" class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <!-- Non-boolean fields first -->
                    <template
                      v-for="(propValue, propKey) in nonBooleanFields(filteredData[activeTab][activeSubTab])"
                      :key="propKey"
                    >
                      <InputTransparent
                        :label="formatLabel(propKey)"
                        :placeholder="String(propValue)"
                        v-model="transformedData[activeTab][activeSubTab][propKey]"
                        :type="getEnumOptions(activeTab, propKey) ? 'select' : 'text'"
                        :options="getEnumOptions(activeTab, propKey) || undefined"
                        class="w-full m-1"
                      />
                    </template>
                    <!-- Boolean fields -->
                    <template
                      v-for="(propValue, propKey) in booleanFields(filteredData[activeTab][activeSubTab])"
                      :key="propKey"
                    >
                      <div class="flex items-center space-x-3 mx-3">
                        <label :for="`${activeTab}-${activeSubTab}-${propKey}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">{{
                          formatLabel(propKey)
                        }}</label>
                        <label class="inline-flex items-center cursor-pointer ml-auto">
                          <input
                            type="checkbox"
                            class="sr-only peer"
                            :id="`${activeTab}-${activeSubTab}-${propKey}`"
                            v-model="transformedData[activeTab][activeSubTab][propKey]"
                          />
                          <div
                            :class="[
                              'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                              transformedData[activeTab][activeSubTab][propKey]
                                ? 'boolean-selector-active'
                                : 'boolean-selector-inactive'
                            ]"
                            style="border: 0px solid var(--toggle-border);"
                          ></div>
                        </label>
                      </div>
                    </template>
                    <!-- Array fields as collapsible property -->
                    <details>
                      <summary class="font-semibold">...</summary>
                    
                    <template v-if="Object.keys(arrayFields(filteredData[activeTab][activeSubTab])).length">
                      <template v-for="(arr, arrKey) in arrayFields(filteredData[activeTab][activeSubTab])" :key="`array-${arrKey}`">
                        <details class=" my-2">
                          <summary class="font-semibold ">{{ formatLabel(arrKey) }} ({{ Array.isArray(arr) ? arr.length : 0 }})</summary>
                          <div v-if="Array.isArray(arr) && arr.length > 0" class="space-y-2 mt-2">
                            <div v-for="(element, idx) in arr" :key="`element-${arrKey}-${idx}`" class="border border-gray-200 dark:border-neutral-700 rounded p-2 mb-2">
                              <div v-if="typeof element === 'object' && element !== null">
                                <details class="mb-2">
                                  <summary class="font-semibold cursor-pointer">{{ formatLabel(arrKey) }} Item {{ idx + 1 }}</summary>
                                  <div class="mt-2">
                                    <template v-for="(elValue, elKey) in element" :key="elKey">
                                        <div v-if="typeof elValue === 'object' && elValue !== null">
                                            <details class="mb-2">
                                                <summary class="font-semibold cursor-pointer">{{ formatLabel(elKey) }} Item {{ idx + 1 }}</summary>
                                                 <div class="mt-2">
                                                    <template v-for="(subElValue, subElKey) in elValue" :key="subElKey">

                                                        <InputTransparent
                                                            :label="formatLabel(subElKey)"
                                                            :placeholder="String(subElValue)"
                                                            v-model="transformedData[activeTab][activeSubTab][arrKey][idx][elKey][subElKey]"
                                                            class="w-full m-1"
                                                        />
                                                        </template>

                                                 </div>
                                            </details>
                                        </div>

                                        <div v-else class="text-gray-600 dark:text-gray-400">
                                            <InputTransparent
                                            :label="formatLabel(elKey)"
                                            :placeholder="String(elValue)"
                                            v-model="transformedData[activeTab][activeSubTab][arrKey][idx][elKey]"
                                            class="w-full m-1"
                                        />
                                        </div>

                                        
                                    
                                      
                                    </template>
                                  </div>
                                </details>
                              </div>
                              <div v-else class="text-gray-600 dark:text-gray-400">
                                {{ element }}
                              </div>
                            </div>
                          </div>
                          <div v-else class="text-gray-500 dark:text-gray-400 italic">No items</div>
                        </details>
                      </template>
                    </template>
            </details>

                  </div>
                  <div v-else class="text-gray-600 dark:text-gray-400">
                    {{ filteredData[activeTab][activeSubTab] }}
                  </div>
                </div>
              </div>
            </template>
            
            
            <!-- List tabs - show all array items (when no sub-tab is selected) -->
            <template v-else-if="Array.isArray(filteredData[activeTab]) && activeSubTab === null">
              <div class="space-y-4">
                <div v-if="filteredData[activeTab].length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8">
                  No {{ formatLabel(activeTab).toLowerCase() }} configured
                </div>
                <div 
                  v-for="(item, index) in filteredData[activeTab]" 
                  :key="index"
                  class="bg-white bg-modal-color rounded-lg border border-gray-200 dark:border-neutral-700 p-4 shadow-sm cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  @click="selectSubTab(activeTab, index)"
                >
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {{ formatLabel(activeTab).slice(0, -1) }} {{ index + 1 }}
                  </h3>
                  <div v-if="typeof item === 'object' && item !== null" class="text-sm text-gray-600 dark:text-gray-400">
                    Click to edit this {{ formatLabel(activeTab).slice(0, -1).toLowerCase() }}
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

/* Hide the default triangle/marker for <summary> in <details> */
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}

/* Tint payment icon to white in dark mode */
.dark .payment-icon {
  filter: brightness(0) invert(1);
}
/* Sub-tab open/close animation */
.subtab-fade-enter-active, .subtab-fade-leave-active {
  transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}
.subtab-fade-enter-from, .subtab-fade-leave-to {
  max-height: 0;
  opacity: 0;
}
.subtab-fade-enter-to, .subtab-fade-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
