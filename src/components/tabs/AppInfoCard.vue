<template>
  <div
    class="bg-white rounded-2xl shadow-inner bg-modal-color border border-color flex flex-col transition-all duration-300 overflow-hidden m-5"
    :class="{ 'max-h-16 cursor-pointer': closed, 'max-h-[600px]': !closed }"
    @click="closed ? openCard() : null"
    style="min-height: 3.5rem"
  >
    <div
      class="w-full flex items-center px-4 py-2.5 m-2 justify-between cursor-pointer select-none"
      @click.stop="closed = !closed"
      :aria-expanded="!closed"
      :aria-controls="'app-info-body'"
      role="button"
      tabindex="0"
    >
      <span class="font-semibold text-gray-900 dark:text-white">{{ info.Id }}</span>
      <span class="font-semibold text-gray-900 dark:text-white"
        >Status: {{ info.Status }}</span
      >
      <svg
        class="w-2.5 h-2.5 ml-2 transition-transform duration-200"
        :class="closed ? '' : 'rotate-180'"
        fill="none"
        viewBox="0 0 10 6"
        stroke="white"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m1 1 4 4 4-4" />
      </svg>
    </div>
    <div v-show="!closed"
      class="bg-white rounded-2xl shadow-inner modal-color-dark border border-color-light overflow-hidden m-2"
      style="min-height: 3.5rem"
    >
      <div class="grid grid-cols-1 md:grid-cols-1 gap-x-10 gap-y-2 p-4">
        <div class="font-semibold text-gray-900 dark:text-white">
          <span class="font-semibold">Hash:</span> {{ info.Hash }}
        </div>
        <div class="font-semibold text-gray-900 dark:text-white">
          <span class="font-semibold">Version:</span> {{ info.Version }}
        </div>
        <div class="font-semibold text-gray-900 dark:text-white">
          <span class="font-semibold">Start Up Time:</span>
          {{ formatDate(info.StartUpTime) }}
        </div>
        <div class="font-semibold text-gray-900 dark:text-white">
          <span class="font-semibold">Message:</span> {{ info.Message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
});

const closed = ref(false);

function closeCard() {
  closed.value = true;
}
function openCard() {
  closed.value = false;
}

function formatDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString();
}
</script>
