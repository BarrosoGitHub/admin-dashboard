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
        <span class="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">EPS Configuration</span>
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
              <li v-for="(label, idx) in tabLabels" :key="label" class="flex">
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
                v-if="tabLabels[currentPage] && getTabFields(tabLabels[currentPage])"
                :key="tabLabels[currentPage] + searchValue"
                class="rounded-xl md:px-20 flex-1 overflow-y-auto"
              >
                <div v-if="tabLabels[currentPage] === 'General'">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      v-for="(value, prop) in nonBooleanFields(filteredTabFields)"
                      :key="prop"
                      class="mb-2 dark:text-white"
                    >
                      <label
                        :for="`general-${prop}`"
                        class="block mb-2 text-sm font-medium dark:text-white"
                      >
                        {{ formatLabel(prop) }}
                      </label>
                      <div class="shadow-sm rounded-full">
                        <input
                          v-if="!getEnumOptions('General', prop)"
                          :id="`general-${prop}`"
                          v-model="fields[prop]"
                          type="text"
                          class="bg-input-color text-gray-900 text-sm rounded-md border input-border-color focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white shadow-sm"
                        />
                        <select
                          v-else
                          :id="`general-${prop}`"
                          v-model="fields[prop]"
                          class="bg-input-color text-gray-900 text-sm rounded-md border input-border-color focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white shadow-sm"
                        >
                          <option
                            v-for="option in getEnumOptions('General', prop)"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <template v-if="Object.keys(booleanFields(filteredTabFields)).length">
                      <div class="col-span-full">
                        <hr class="my-4 border border-color" />
                      </div>
                    </template>
                    <div
                      v-for="(value, prop) in booleanFields(filteredTabFields)"
                      :key="prop"
                      class="mb-2 dark:text-white flex items-center space-x-3"
                    >
                      <label :for="`general-${prop}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">
                        {{ formatLabel(prop) }}
                      </label>
                      <label class="inline-flex items-center cursor-pointer ml-auto">
                        <input
                          type="checkbox"
                          class="sr-only peer"
                          :id="`general-${prop}`"
                          v-model="fields[prop]"
                        />
                        <div
                          :class="[
                            'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                            fields[prop]
                              ? 'boolean-selector-active'
                              : 'boolean-selector-inactive'
                          ]"
                          style="border: 0px solid var(--toggle-border);"
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="flex flex-col gap-4">
                    <div v-if="Array.isArray(filteredTabFields)">
                      <div v-for="(item, idx) in filteredTabFields" :key="idx" class="border border-color rounded-lg p-4 mb-2">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div v-for="(val, key) in item" :key="key">
                            <label :for="`${tabLabels[currentPage]}-${key}-${idx}`" class="block text-xs font-medium dark:text-white mb-1">
                              {{ formatLabel(key) }}
                            </label>
                            <input
                              v-if="!getEnumOptions(tabLabels[currentPage], key)"
                              :id="`${tabLabels[currentPage]}-${key}-${idx}`"
                              v-model="item[key]"
                              type="text"
                              class="bg-input-color text-gray-900 text-sm rounded-md border input-border-color focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white shadow-sm"
                            />
                            <select
                              v-else
                              :id="`${tabLabels[currentPage]}-${key}-${idx}`"
                              v-model="item[key]"
                              class="bg-input-color text-gray-900 text-sm rounded-md border input-border-color focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white shadow-sm"
                            >
                              <option
                                v-for="option in getEnumOptions(tabLabels[currentPage], key)"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 dark:text-gray-400">
                No data
              </div>
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
import { reactive, defineProps, defineEmits, watch, ref, computed } from "vue";
import enumOptions, {
  getEnumOptions as getEnumOptionsHelper,
} from "../../enums/enumOptions.js";
// Import axios
import axios from "axios";
import { API_BASE_URL } from '@/apiConfig.js';
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

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const fields = reactive(clone(props.data));
const currentPage = ref(0);
const searchValue = ref('');


function isArrayField(key) {
  return Array.isArray(fields[key]);
}

const tabLabels = computed(() => {
  const allKeys = Object.keys(fields);
  const generalFields = allKeys.filter(key => !isArrayField(key));
  const arrayFields = allKeys.filter(key => isArrayField(key));
  const tabs = [];
  if (generalFields.length) tabs.push('General');
  arrayFields.forEach(key => tabs.push(key));
  return tabs;
});

function getTabFields(tab) {
  if (tab === 'General') {
    return Object.fromEntries(Object.entries(fields).filter(([k, v]) => !Array.isArray(v)));
  } else {
    return fields[tab];
  }
}

const filteredTabFields = computed(() => {
  const tab = tabLabels.value[currentPage.value];
  const allFields = getTabFields(tab);
  const search = searchValue.value.trim().toLowerCase();
  if (!search) return allFields;
  if (tab === 'General') {
    return Object.fromEntries(
      Object.entries(allFields).filter(([prop, value]) =>
        prop.toLowerCase().includes(search) || String(value).toLowerCase().includes(search)
      )
    );
  } else if (Array.isArray(allFields)) {
    return allFields.filter(item =>
      Object.entries(item).some(([prop, value]) =>
        prop.toLowerCase().includes(search) || String(value).toLowerCase().includes(search)
      )
    );
  }
  return allFields;
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
      `${API_BASE_URL}/eps-configuration/new`,
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
