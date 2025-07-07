<script setup>
import { ref, defineProps, watch, computed, defineEmits } from "vue";
import InputTransparent from "../inputs/InputTransparent.vue";
import { DeviceTabletIcon } from '@heroicons/vue/24/outline'

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

const emit = defineEmits(["update"]);

const activeTab = ref("General");
const localData = ref(JSON.parse(JSON.stringify(props.data)));

watch(
  () => props.data,
  (newData) => {
    localData.value = JSON.parse(JSON.stringify(newData));
  }
);

const filteredData = computed(() => {
  if (!props.searchValue.trim()) return localData.value;
  const result = {};
  const search = props.searchValue.toLowerCase();
  for (const [key, value] of Object.entries(localData.value)) {
    if (key === "GradeColors") {
      // Always include GradeColors in filtered data
      result[key] = value;
      continue;
    }
    if (key.toLowerCase().includes(search) || String(value).toLowerCase().includes(search)) {
      result[key] = value;
    }
  }
  return result;
});

function updateConfiguration() {
  const config = { ...localData.value };
  if (Array.isArray(localData.value.GradeColors)) {
    config.GradeColors = localData.value.GradeColors.map(g => ({ ...g }));
  }
  emit("update", { config });
}

function formatLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
}

function nonBooleanFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => typeof v !== 'boolean' && k !== 'GradeColors')
  );
}
function booleanFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => typeof v === 'boolean')
  );
}

function addGradeColor() {
  if (!Array.isArray(localData.value.GradeColors)) {
    localData.value.GradeColors = [];
  }
  
  let nextNumber = localData.value.GradeColors.length + 1;
  let newKey = `New${nextNumber}`;
  while (localData.value.GradeColors.some(g => Object.keys(g)[0] === newKey)) {
    newKey = `New${++nextNumber}`;
  }
  localData.value.GradeColors.push({ [newKey]: '' });
}
function removeGradeColor(idx) {
  if (Array.isArray(localData.value.GradeColors)) {
    localData.value.GradeColors.splice(idx, 1);
  }
}
</script>

<template>
  <div v-if="props.show" class="py-10 px-8 ">
    <div class="w-full min-w-[320px] max-w-full md:w-[60vw] md:min-w-[600px] md:max-w-[70vw] rounded-2xl border border-color flex flex-col bg-modal-color shadow-xs dark:shadow-lg">
      <!-- Top line with label -->
      <div class="w-full flex items-center border-b border-color px-8 py-4 mb-2">
        <span class="text-xl font-semibold text-color tracking-wide">User Interface</span>
      </div>
      <div class="flex flex-1 min-h-0">
        <!-- Tabs on the left (only one tab for this object) -->
        <ul
          class="flex flex-col w-65 min-w-44 text-sm font-medium text-left text-white-900 dark:text-white-900 py-2 px-5"
          role="tablist"
        >
          <li class="flex">
            <button
              type="button"
              class="flex items-center flex-1 text-left px-2 py-2 rounded-md my-1.5 mx-3 cursor-pointer text-color  font-semibold"
              disabled
            >
              <DeviceTabletIcon class="w-5 h-5 mr-2" />
              General
            </button>
          </li>
        </ul>
        <!-- Content on the right -->
        <div class="flex-1 min-h-0 flex flex-col">
          <div
            v-if="true"
            :key="activeTab + props.searchValue"
            class="rounded-xl md:px-20 flex-1 overflow-y-auto"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
              <!-- Non-boolean fields first, excluding GradeColors -->
              <template
                v-for="(propValue, propKey) in nonBooleanFields(filteredData)"
                :key="propKey"
              >
                <div>
                  <InputTransparent
                    :label="formatLabel(propKey)"
                    :placeholder="String(propValue)"
                    v-model="localData[propKey]"
                    class="w-full"
                  />
                </div>
              </template>
              <!-- Separator line before booleans, only if there are boolean fields -->
              <template v-if="Object.keys(booleanFields(filteredData)).length">
                <div class="col-span-full">
                  <hr class="my-4 border border-color" />
                </div>
              </template>
              <!-- Boolean fields at the end, with slider (no icon) -->
              <template
                v-for="(propValue, propKey) in booleanFields(filteredData)"
                :key="propKey"
              >
                <div class="flex items-center space-x-3">
                  <label :for="`ui-${propKey}`" class="block text-sm font-medium text-gray-900 dark:text-white flex-1 mb-0">{{
                    formatLabel(propKey)
                  }}</label>
                  <!-- Slider toggle switch -->
                  <label class="inline-flex items-center cursor-pointer ml-auto">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      :id="`ui-${propKey}`"
                      v-model="localData[propKey]"
                    />
                    <div
                      :class=" [
                        'relative w-11 h-6 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                        localData[propKey]
                          ? 'boolean-selector-active'
                          : 'boolean-selector-inactive'
                      ]"
                      style="border: 0px solid var(--toggle-border);"
                    ></div>
                  </label>
                </div>
              </template>
              <!-- Separator line before GradeColors, only if GradeColors exists -->
              <template v-if="Array.isArray(localData.GradeColors)">
                <div class="col-span-full">
                  <hr class="my-4 border border-color" />
                </div>
                <div class="col-span-full">
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Grade Colors</label>
                  <div class="grid grid-cols-1 gap-y-2">
                    <div
                      v-for="(grade, idx) in localData.GradeColors"
                      :key="idx"
                      class="flex items-center gap-2 mb-2"
                    >
                      <span class="text-xs text-gray-500">Grade {{ Object.keys(grade)[0] }}</span>
                      <Input
                        :label="null"
                        :placeholder="Object.values(grade)[0]"
                        v-model="localData.GradeColors[idx][Object.keys(grade)[0]]"
                        class="w-full"
                      />
                      <button
                        type="button"
                        class="ml-2 px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
                        @click="removeGradeColor(idx)"
                        title="Remove this grade color"
                      >
                        Remove
                      </button>
                    </div>
                    <button
                      type="button"
                      class="mt-2 px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700 w-fit"
                      @click="addGradeColor"
                    >
                      + Add Grade Color
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row items-center justify-end gap-4 mt-8 mb-4 px-8">
        <button
          @click="updateConfiguration"
          class="p-4 text-white bg-blue-600 focus:outline-none hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-full text-sm px-10 py-2.5 dark:bg-blue-700 dark:text-white dark:border-blue-600 dark:hover:bg-blue-800 dark:hover:border-blue-600 dark:focus:ring-blue-800"
        >
          Update User Interface
        </button>
      </div>
    </div>
  </div>
</template>