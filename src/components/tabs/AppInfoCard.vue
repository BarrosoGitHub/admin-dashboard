<template>
  <div>
    <div
      class="bg-modal-color-gradient rounded-2xl flex flex-col transition-all duration-300 overflow-hidden m-5 p-4 border border-color group relative appinfocard-anim"
      :class="[
        hovering ? 'shadow-lg' : 'shadow-sm',
        smallVersion
          ? (hovering
              ? 'min-w-[350px] min-h-[120px] max-w-xs scale-100 z-50'
              : 'min-w-[350px] min-h-[60px] max-w-xs scale-100')
          : 'min-w-[200px] min-h-[240px] max-w-lg'
      ]"
      :style="smallVersion ? (hovering ? 'height: 200px;' : 'height: 150px;') : ''"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <div
        class="w-full flex items-center justify-between cursor-pointer select-none mb-3 "
        :aria-expanded="true"
        :aria-controls="'app-info-body'"
        role="button"
        tabindex="0"
      >
        <div class="contents items-center ">
          <div class="w-10 h-10 rounded-full bg-neutral-300 contents items-center justify-center shadow ">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
          <div style="min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; width: 100%; height: 2.5em;"
            :class="[
              'p-2 transition-all duration-300 ',
              hovering ? 'items-center justify-center' : '',
              info.Status === 'Stopped' ? 'text-neutral-500 text-bold' : 'text-neutral-200'
            ]"
          >
            <div class="leading-tight max-w-full my-2 transition-all duration-200"
              :class="['py-2',
                hovering ? 'text-lg ' : 'text-2xl ',
                info.Status === 'Stopped' ? 'text-neutral-500 dark:text-neutral-500' : 'text-neutral-200'
              ]"
              style="line-height: 1; height: 1.2em;"
            >{{ info.Id }}</div>
            <div class="leading-tight max-w-full transition-all duration-200"
              :class="[
                hovering ? 'text-sm' : 'text-md',
                info.Status === 'Stopped' ? 'text-neutral-500' : 'text-neutral-300'
              ]"
              style="line-height: 1; height: 1.3em;"
            >Status: <span :class="(info.Status === 'Stopped' ? 'text-neutral-500' : 'text-neutral-300')">{{ info.Status }}</span></div>
          </div>
        </div>
      </div>
      <transition name="fade-slide">
        <div
          class="grid grid-cols-3 gap-x-4 gap-y-2 text-xs group"
          style="min-height: 80px; max-height: 100px;"
        >
          <div class="flex flex-col gap-1 px-2 py-4 items-center justify-center h-full">
            <span class="flex items-center justify-center gap-1 transition-all group-hover:translate-y-0 translate-y-7 opacity-0 group-hover:opacity-100 duration-150"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-400'"
              style="min-height:48px;"
            >
              <component :is="iconMap.Hash" class="w-6 h-6" :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-neutral-300'" />
            </span>
            <span class="font-semibold break-all text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-700 dark:text-white'"
            >
              {{ info.Hash }}
            </span>
          </div>
          <div class="flex flex-col gap-1 px-2 py-4 items-center justify-center h-full">
            <span class="flex items-center justify-center gap-1 transition-all group-hover:translate-y-0 translate-y-7 opacity-0 group-hover:opacity-100 duration-300"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-400'"
              style="min-height:48px;"
            >
              <component :is="iconMap.Version" class="w-6 h-6" :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-neutral-300'" />
            </span>
            <span class="font-semibold break-all text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-700 dark:text-white'"
            >
              {{ info.Version }}
            </span>
          </div>
          <div class="flex flex-col gap-1 px-2 py-4 items-center justify-center h-full ">
            <span class="flex items-center justify-center gap-1 transition-all group-hover:translate-y-0 translate-y-7 opacity-0 group-hover:opacity-100 duration-450"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-400'"
              style="min-height:48px;"
            >
              <component :is="iconMap.StartUpTime" class="w-6 h-6" :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-neutral-300'" />
            </span>
            <span class="font-semibold break-all text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-700 dark:text-white'"
            >
              {{ formatDate(info.StartUpTime) }}
            </span>
          </div>
          <div class="col-span-3 mt-1 pt-2 flex flex-col gap-1 px-2 items-center">
            <span class="font-semibold break-all text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              :class="info.Status === 'Stopped' ? 'text-neutral-500' : 'text-gray-700 dark:text-white'"
            >
              {{ info.Message }}
            </span>
          </div>
        </div>
      </transition>
      <!-- Status icon in bottom right -->
      <span
        :class="[
          'flex items-center justify-end w-full transition-all duration-200',
          'absolute right-4 bottom-4',
          hovering ? 'opacity-0 translate-y-1' : 'opacity-100',
          info.Status === 'Stopped' ? 'text-neutral-500' : 'text-neutral-200'
        ]"
        style="pointer-events: none;"
      >
        <CheckCircleIcon v-if="info.Status === 'Healthy'" class="h-10 w-10" />
        <ExclamationTriangleIcon v-else class="h-10 w-10" />
      </span>
    </div>
  </div>

</template>

<script setup>
import { defineProps, ref } from "vue";
import {
  TagIcon,
  ClockIcon,
  CpuChipIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const iconMap = {
  Version: TagIcon,
  StartUpTime: ClockIcon,
  Hash: CpuChipIcon
};

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
  smallVersion: {
    type: Boolean,
    default: true
  }
});

const hovering = ref(false);

function formatDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString();
}
</script>

<style scoped>
.bg-white {
  background: #fff;
}
.shadow-md {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
}
.appinfocard-anim {
  transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s, background 0.3s, min-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
