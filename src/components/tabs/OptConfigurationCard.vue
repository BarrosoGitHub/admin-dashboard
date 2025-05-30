<script setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";
import Input from "../inputs/Input.vue";
import SearchBar from "../searchbar/SearchBar.vue";
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
});

const activeTab = ref(Object.keys(props.data)[0] || "");
const localData = ref(JSON.parse(JSON.stringify(props.data)));
const searchValue = ref("");

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
  if (!searchValue.value.trim()) return localData.value;
  const result = {};
  const search = searchValue.value.toLowerCase();
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
  emit("update", {
    config: localData.value,
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
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v !== 'boolean'));
}
function booleanFields(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => typeof v === 'boolean'));
}
</script>

<template>
  <div v-if="props.show" class="py-10 px-30 ">
    <div class="w-full  bg-white rounded-2xl shadow-inner bg-modal-color border border-color flex flex-col">
      <!-- Top line with label -->
      <div class="w-full flex items-center border-b border-color px-5 py-4 mb-2">
        <span class="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">OPT Configuration</span>
        <div class="justify-end flex-1 flex items-start">
          <SearchBar
            v-model="searchValue"
            label="Search"
            placeholder="Type to search..."
          />
        </div>
      </div>
      
      <div class="flex flex-1 min-h-0">
        <!-- Tabs on the left -->
        <ul
          class="flex flex-col w-65 min-w-44 text-sm font-medium text-left text-white-900 dark:text-white-900 py-2 px-5"
          role="tablist"
        >
          <li v-for="key in Object.keys(filteredData)" :key="key" class="flex">
            <button
              type="button"
              class="flex items-center flex-1 text-left px-2 py-2 rounded-md my-1.5 mx-3 cursor-pointer"
              :class="activeTab === key
                ? 'text-white bg-neutral-700 font-semibold'
                : 'text-gray-700 dark:text-gray-300'"
              @click="activeTab = key"
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
            </button>
          </li>
        </ul>
        <!-- Content on the right -->
        <div class="flex-1 min-h-0 flex flex-col">
          <div
            v-if="activeTab && filteredData[activeTab]"
            :key="activeTab + searchValue"
            class="rounded-xl md:px-20 flex-1 overflow-y-auto"
          >
            <h2
              class="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
            </h2>
            <template
              v-if="filteredData[activeTab] && typeof filteredData[activeTab] === 'object'"
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-2">
                <!-- Non-boolean fields first -->
                <template
                  v-for="(propValue, propKey) in nonBooleanFields(filteredData[activeTab])"
                  :key="propKey"
                >
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                      formatLabel(propKey)
                    }}</label>
                    <!-- Enum dropdown -->
                    <div class="grid gap-6 mb-6 shadow-sm rounded-md border input-border-color" v-if="getEnumOptions(activeTab, propKey)">
                      <select
                        class="bg-gray-50 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 bg-input-color dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        v-model="localData[activeTab][propKey]"
                      >
                        <option
                          v-if="getEnumOptions(activeTab, propKey).find(o => o.value === localData[activeTab][propKey])"
                          :value="localData[activeTab][propKey]"
                        >
                          {{
                            getEnumOptions(activeTab, propKey).find(o => o.value === localData[activeTab][propKey])?.label
                          }}
                        </option>
                        <option disabled v-if="getEnumOptions(activeTab, propKey).length > 1">──────────</option>
                        <option
                          v-for="option in getEnumOptions(activeTab, propKey).filter(o => o.value !== localData[activeTab][propKey])"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                    <!-- Default input -->
                    <Input
                      v-else
                      :label="null"
                      :placeholder="String(propValue)"
                      v-model="localData[activeTab][propKey]"
                      class="w-full"
                    />
                  </div>
                </template>
                <!-- Separator line before booleans, only if there are boolean fields -->
                <template v-if="Object.keys(booleanFields(filteredData[activeTab])).length">
                  <div class="col-span-full">
                    <hr class="my-4 border border-color" />
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
