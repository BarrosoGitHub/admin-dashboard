<script setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";
import Input from "../inputs/Input.vue";
import SearchBar from "../searchbar/SearchBar.vue";
import enumOptions, {
  getEnumOptions as getEnumOptionsHelper,
} from "../../enums/enumOptions.js";

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
</script>

<template>
  <div v-if="props.show" class="p-8 bg-gray-50 dark:bg-gray-900">
    <div
      class="w-full bg-white rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700"
    >
      <ul
        class="grid w-full text-sm font-medium text-center text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 xl:grid-cols-17"
        role="tablist"
      >
        <li v-for="key in Object.keys(filteredData)" :key="key" class="flex relative">
          <button
            type="button"
            class="w-full flex-1 inline-block p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :class="
              activeTab === key
                ? 'text-blue-600 dark:text-blue-500'
                : 'hover:text-gray-600 dark:hover:text-gray-300'
            "
            @click="activeTab = key"
          >
            {{
              formatLabel(key)
                .replace(/configuration/i, "")
                .trim()
            }}
            <span
              v-if="activeTab === key"
              class="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded transition-all duration-300"
            ></span>
          </button>
        </li>
      </ul>
      <div>
        <div
          v-if="activeTab && filteredData[activeTab]"
          :key="activeTab + searchValue"
          class="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800"
        >
          <h2
            class="mb-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          >
            {{
              formatLabel(activeTab)
                .replace(/configuration/i, "")
                .trim()
            }}
          </h2>
          <template
            v-if="filteredData[activeTab] && typeof filteredData[activeTab] === 'object'"
          >
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-2">
              <template
                v-for="(propValue, propKey) in filteredData[activeTab]"
                :key="propKey"
              >
                <div class="">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                    formatLabel(propKey)
                  }}</label>

                  <!-- Boolean dropdown -->
                  <div class="grid gap-6 mb-6 shadow-md rounded-full" v-if="typeof propValue === 'boolean'">
                    <select
                    
                    class="bg-gray-50 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    v-model="localData[activeTab][propKey]"
                  >
                    <option :value="true">True</option>
                    <option :value="false">False</option>
                  </select>
                  </div>

                  <!-- Enum dropdown -->
                  <div class="grid gap-6 mb-6 shadow-md rounded-full" v-else-if="getEnumOptions(activeTab, propKey)">
                    <select
                      class="bg-gray-50 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      v-model="localData[activeTab][propKey]"
                    >
                      <!-- Show selected option first -->
                      <option
                        v-if="getEnumOptions(activeTab, propKey).find(o => o.value === localData[activeTab][propKey])"
                        :value="localData[activeTab][propKey]"
                      >
                        {{
                          getEnumOptions(activeTab, propKey).find(o => o.value === localData[activeTab][propKey])?.label
                        }}
                      </option>
                      <!-- Separator if there are other options -->
                      <option disabled v-if="getEnumOptions(activeTab, propKey).length > 1">──────────</option>
                      <!-- Show remaining options (not selected) -->
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
        <div class="flex justify-end mt-4">
          <SearchBar
            v-model="searchValue"
            label="Search"
            placeholder="Type to search..."
          />
            <button
            @click="updateConfiguration"
            class="p-4 mx-8 text-white bg-blue-600 focus:outline-none hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-full text-sm px-10 py-2.5 mb-6 dark:bg-blue-700 dark:text-white dark:border-blue-600 dark:hover:bg-blue-800 dark:hover:border-blue-600 dark:focus:ring-blue-800 float-right"
          >
            Update Configuration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
