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
      <div
        class="relative p-8 w-full max-w-5xl max-h-full min-h-[600px] min-w-[1100px] flex items-center justify-center"
      >
      
        <!-- Modal content -->
        <div
          class="relative bg-modal-color rounded-2xl shadow-inner border border-color flex flex-col w-full"
          style="width: 1100px; height: 700px; min-width: 1300px; min-height: 900px; max-width: 1300px; max-height: 900px;"
        >
          <!-- Top line with label and search -->
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
              class="flex flex-col w-63 min-w-44 text-sm font-medium text-left text-white-900 dark:text-white-900 py-1 px-5"
              role="tablist"
            >
              <li v-for="(label, idx) in filteredGroupLabels" :key="label" class="flex">
                <button
                  type="button"
                  class="flex items-center flex-1 text-left px-2 py-2 rounded-md my-0.75 mx-3 cursor-pointer"
                  :class="currentPage === idx
                    ? 'text-white bg-neutral-700 font-semibold'
                    : 'text-gray-700 dark:text-gray-300'"
                  @click="currentPage = idx"
                >
                  <component
                    :is="iconMap[label] || Cog6ToothIcon"
                    class="w-5 h-5 mr-2"
                  />
                  {{ formatLabel(label).replace(/configuration/i, '').trim() }}
                </button>
              </li>
            </ul>
            <!-- Content on the right -->
            <div class="flex-1 min-h-0 table flex-col">
              <div
                v-if="filteredGroupLabels[currentPage] && fields[filteredGroupLabels[currentPage]]"
                :key="filteredGroupLabels[currentPage] + searchValue"
                class="rounded-xl md:px-20 flex-1 overflow-y-auto"
              >
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Non-boolean fields first -->
                  <div
                    v-for="(value, prop) in nonBooleanFields(filteredFields)"
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
                        v-if="getEnumOptionsForProperty(filteredGroupLabels[currentPage], prop)"
                        :id="`${filteredGroupLabels[currentPage]}-${prop}`"
                        v-model="fields[filteredGroupLabels[currentPage]][prop]"
                        class="bg-input-color text-gray-900 text-sm rounded-md border input-border-color focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white shadow-sm"
                      >
                        <option
                          v-if="getEnumOptionsForProperty(filteredGroupLabels[currentPage], prop).find(o => o.value === fields[filteredGroupLabels[currentPage]][prop])"
                          :value="fields[filteredGroupLabels[currentPage]][prop]"
                        >
                          {{
                            getEnumOptionsForProperty(filteredGroupLabels[currentPage], prop).find(o => o.value === fields[filteredGroupLabels[currentPage]][prop])?.label
                          }}
                        </option>
                        <option disabled v-if="getEnumOptionsForProperty(filteredGroupLabels[currentPage], prop).length > 1">──────────</option>
                        <option
                          v-for="option in getEnumOptionsForProperty(filteredGroupLabels[currentPage], prop).filter(o => o.value !== fields[filteredGroupLabels[currentPage]][prop])"
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
                        class="bg-input-color text-gray-900 text-sm rounded-md border input-border-color focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white shadow-sm"
                      />
                    </div>
                  </div>
                  <!-- Separator line before booleans, only if there are boolean fields -->
                  <template v-if="Object.keys(booleanFields(filteredFields)).length">
                    <div class="col-span-full">
                      <hr class="my-4 border border-color" />
                    </div>
                  </template>
                  <!-- Boolean fields at the end -->
                  <div
                    v-for="(value, prop) in booleanFields(filteredFields)"
                    :key="prop"
                    class="mb-2 dark:text-white flex items-center space-x-3"
                  >
                    <label :for="`${filteredGroupLabels[currentPage]}-${prop}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">
                      {{ formatLabel(prop) }}
                    </label>
                    <label class="inline-flex items-center cursor-pointer ml-auto">
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
                    </label>
                  </div>
                </div>
              </div>
              <div v-else-if="fields[filteredGroupLabels[currentPage]] === null" class="text-gray-500 dark:text-gray-400">
                No data
              </div>
              <pre v-else class="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded p-2 overflow-x-auto">{{ fields[filteredGroupLabels[currentPage]] }}</pre>
            </div>
          </div>
               <div class="flex justify-end mt-8 px-3 py-3">
                  <button
                    type="submit"
                    @click="submitForm"
                    class="px-8 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Create Template
                  </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import SearchBar from "../searchbar/SearchBar.vue";
import { reactive, defineProps, defineEmits, watch, ref, computed, onMounted } from "vue";
import enumOptions, {
  getEnumOptions as getEnumOptionsHelper,
} from "../../enums/enumOptions.js";
// Import axios
import axios from "axios";
import { API_BASE_URL } from '@/apiConfig.js';
import { getApiBaseUrl } from "../../apiConfig.js";
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
} from "@heroicons/vue/24/outline";

const getEnumOptions = getEnumOptionsHelper;
const dynamicEnums = ref({});

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => ({
      "User Info": {
        Name: "",
        Email: "",
      },
      Settings: {
        Theme: "Light",
        Notifications: true,
      },
    }),
  },
});

const emit = defineEmits(["close", "submit"]);

// Fetch dynamic enums on component mount
onMounted(async () => {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const token = localStorage.getItem('jwt');
    
    const enumsResponse = await fetch(`${apiBaseUrl}/opt-configuration/enums`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    
    if (enumsResponse.ok) {
      dynamicEnums.value = await enumsResponse.json();
      console.log('OPT Template modal enums loaded:', dynamicEnums.value);
    } else {
      console.error('Failed to fetch OPT enums:', enumsResponse.status, enumsResponse.statusText);
    }
  } catch (error) {
    console.error('Failed to fetch OPT enums:', error);
  }
});

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const fields = reactive(clone(props.data));
const currentPage = ref(0);
const searchValue = ref('');

// --- Filtered group labels based on search ---
const filteredGroupLabels = computed(() => {
  const search = searchValue.value.trim().toLowerCase();
  return Object.keys(fields).filter((key) => {
    const group = fields[key];
    if (!group || typeof group !== 'object' || !Object.keys(group).length) return false;
    if (!search) return true;
    if (key.toLowerCase().includes(search)) return true;
    // Only include group if at least one field matches
    return Object.entries(group).some(([prop, value]) =>
      prop.toLowerCase().includes(search) || String(value).toLowerCase().includes(search)
    );
  });
});

// --- Filtered fields for the current tab, based on search ---
const filteredFields = computed(() => {
  const group = filteredGroupLabels.value[currentPage.value];
  if (!group) return {};
  const allFields = fields[group] || {};
  const search = searchValue.value.trim().toLowerCase();
  if (!search) return allFields;
  // Only show fields that match search in key or value
  return Object.fromEntries(
    Object.entries(allFields).filter(([prop, value]) =>
      prop.toLowerCase().includes(search) || String(value).toLowerCase().includes(search)
    )
  );
});

function nonBooleanFields(obj = {}) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => typeof v !== 'boolean'));
}
function booleanFields(obj = {}) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => typeof v === 'boolean'));
}

watch(
  () => props.data,
  (newVal) => {
    Object.assign(fields, clone(newVal));
    currentPage.value = 0;
  },
  { deep: true }
);

// --- Use axios for HTTP POST ---
async function submitForm() {
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.post(
      `${API_BASE_URL}/opt-configuration/new`,
      clone(fields),
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    emit("submit", response.data);
  } catch (error) {
    alert(error?.response?.data?.message || error.message || "Submission failed");
  }
}
// --- End HTTP POST ---

function formatLabel(label) {
  if (!label || typeof label !== "string") return "";
  return label
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
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

// Enhanced function to get enum options - prioritizes dynamic enums over static ones
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
      console.log(`Found enum match: ${prop} -> ${enumKey}`, dynamicEnums.value[enumKey]);
      return formatEnumOptions(dynamicEnums.value[enumKey]);
    }
  }
  
  // Fallback to static enums
  return getEnumOptions(tab, prop);
}

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
};
</script>
