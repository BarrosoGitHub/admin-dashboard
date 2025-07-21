<script setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";
import Input from "../inputs/Input.vue";
import InputTransparent from "../inputs/InputTransparent.vue";
import enumOptions, {
  getEnumOptions as getEnumOptionsHelper,
} from "../../enums/enumOptions.js";
import {
  HomeIcon,
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
  // ...add more as needed
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

const activeTab = ref(Object.keys(props.data)[0] || "");
const localData = ref(JSON.parse(JSON.stringify(props.data)));

const emit = defineEmits(["update"]);

watch(
  () => props.data,
  (newData) => {
    const keys = Object.keys(newData);
    if (!keys.includes(activeTab.value)) {
      activeTab.value = keys.length ? keys[0] : "";
    }
    localData.value = JSON.parse(JSON.stringify(newData));
  }
);

const filteredData = computed(() => {
  if (!props.searchValue.trim()) return localData.value;
  const result = {};
  const search = props.searchValue.toLowerCase();
  for (const [section, fields] of Object.entries(localData.value)) {
    if (section.toLowerCase().includes(search)) {
      result[section] = fields;
      continue;
    }
    if (typeof fields === "object" && fields !== null) {
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
  const config = { ...localData.value };
  // Handle array fields properly by creating deep copies
  for (const [sectionKey, sectionData] of Object.entries(config)) {
    if (typeof sectionData === 'object' && sectionData !== null) {
      for (const [key, value] of Object.entries(sectionData)) {
        if (Array.isArray(value)) {
          config[sectionKey][key] = value.map(item => ({ ...item }));
        }
      }
    }
  }
  emit("update", {
    config,
  });
}

function formatLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
}

// Map config keys to icons
const iconMap = {
  OptMainConfiguration: HomeIcon,
  PinpadConfiguration: CreditCardIcon,
  FdcConfiguration: Cog6ToothIcon,
  DisplayConfiguration: DeviceTabletIcon,
  PrinterConfiguration: PrinterIcon,
  EpsClientConfiguration: QrCodeIcon,
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

function addArrayItem(tabKey, arrayKey) {
  if (!Array.isArray(localData.value[tabKey][arrayKey])) {
    localData.value[tabKey][arrayKey] = [];
  }
  
  let nextNumber = localData.value[tabKey][arrayKey].length + 1;
  let newKey = `New${nextNumber}`;
  while (localData.value[tabKey][arrayKey].some(item => Object.keys(item)[0] === newKey)) {
    newKey = `New${++nextNumber}`;
  }
  localData.value[tabKey][arrayKey].push({ [newKey]: '' });
}

function removeArrayItem(tabKey, arrayKey, idx) {
  if (Array.isArray(localData.value[tabKey][arrayKey])) {
    localData.value[tabKey][arrayKey].splice(idx, 1);
  }
}
</script>

<template>
  <div v-if="props.show" class="py-10 px-8 ">
    <div class="w-full min-w-[320px] max-w-full md:w-[60vw] md:min-w-[950px] md:max-w-[70vw] rounded-2xl shadow-md bg-modal-color border border-color flex flex-col" style="z-index: 10; position: relative;">
      <!-- Top line with label -->
      <div class="w-full flex items-center border-b border-color px-8 py-4 mb-2">
        <span class="text-xl font-semibold text-gray-900 dark:text-white tracking-wide">OPT Configuration</span>
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
            <template
              v-if="filteredData[activeTab] && typeof filteredData[activeTab] === 'object'"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-15 gap-y-2">
                <!-- Non-boolean fields first -->
                <template
                  v-for="(propValue, propKey) in nonBooleanFields(filteredData[activeTab])"
                  :key="propKey"
                >
                  <InputTransparent
                    :label="formatLabel(propKey)"
                    :placeholder="String(propValue)"
                    v-model="localData[activeTab][propKey]"
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
                  <div class="flex items-center space-x-3">
                    <label :for="`${activeTab}-${propKey}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">{{
                      formatLabel(propKey)
                    }}</label>
                    <!-- Slider toggle switch -->
                    <label class="inline-flex items-center cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        :id="`${activeTab}-${propKey}`"
                        v-model="localData[activeTab][propKey]"
                      />
                      <div
                        :class=" [
                          'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                          localData[activeTab][propKey]
                            ? 'boolean-selector-active'
                            : 'boolean-selector-inactive'
                        ]"
                        style="border: 0px solid var(--toggle-border);"
                      ></div>
                    </label>
                  </div>
                </template>
                <!-- Separator line before Array fields, only if there are array fields -->
                <template v-if="Object.keys(arrayFields(filteredData[activeTab])).length">
                  <div class="col-span-full">
                    <hr class="my-4 border border-color" />
                  </div>
                </template>
                <!-- Array fields (like GradeColors) -->
                <template
                  v-for="(arrayValue, arrayKey) in arrayFields(filteredData[activeTab])"
                  :key="arrayKey"
                >
                  <div class="col-span-full">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ formatLabel(arrayKey) }}</label>
                    <div class="grid grid-cols-1 gap-y-2">
                      <div
                        v-for="(item, idx) in localData[activeTab][arrayKey]"
                        :key="idx"
                        class="flex items-center gap-2 mb-2"
                      >
                        <span class="text-xs text-gray-500">{{ formatLabel(arrayKey).slice(0, -1) }} {{ Object.keys(item)[0] }}</span>
                        <Input
                          :label="null"
                          :placeholder="Object.values(item)[0]"
                          v-model="localData[activeTab][arrayKey][idx][Object.keys(item)[0]]"
                          class="w-full"
                        />
                        <button
                          type="button"
                          class="ml-2 px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
                          @click="removeArrayItem(activeTab, arrayKey, idx)"
                          :title="`Remove this ${formatLabel(arrayKey).slice(0, -1).toLowerCase()}`"
                        >
                          Remove
                        </button>
                      </div>
                      <button
                        type="button"
                        class="mt-2 px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700 w-fit"
                        @click="addArrayItem(activeTab, arrayKey)"
                      >
                        + Add {{ formatLabel(arrayKey).slice(0, -1) }}
                      </button>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <div
              v-else-if="filteredData[activeTab] === null"
              class="text-gray-500 dark:text-gray-400"
            >
              No data
            </div>
            <pre
              v-else
              class="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded p-2 overflow-x-auto"
              >{{ filteredData[activeTab] }}</pre
            >
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
</style>
