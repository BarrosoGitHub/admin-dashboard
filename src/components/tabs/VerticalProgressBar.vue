<template>
  <div class="vertical-bar-container">
    <div
      class="vertical-bar group"
      :title="tooltip"
      :style="{
        height: animatedHeight + '%',
        background: '#2563eb'
      }"
    ></div>
    <span v-if="label" class="mt-1 text-xs text-slate-300 font-mono">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  type: {
    type: String,
    default: 'other'
  },
  label: {
    type: String,
    default: ''
  },
  animate: {
    type: Boolean,
    default: false
  }
});

const numericValue = computed(() => {
  if (typeof props.value === 'string') {
    // Remove non-numeric chars (except dot and minus)
    return Number(props.value.replace(/[^\d.\-]/g, ''));
  }
  return Number(props.value);
});

const computedTargetHeight = computed(() => {
  if (props.type === 'cpu') {
    return Math.max(0, Math.min(100, (numericValue.value / 100) * 100));
  }
  return Math.max(0, Math.min(100, numericValue.value));
});

const animatedHeight = ref(0);

watch(
  () => props.animate,
  (newVal) => {
    if (newVal) {
      animatedHeight.value = 0;
      requestAnimationFrame(() => {
        setTimeout(() => {
          animatedHeight.value = computedTargetHeight.value;
        }, 10);
      });
    } else {
      animatedHeight.value = computedTargetHeight.value;
    }
  },
  { immediate: true }
);

watch(
  computedTargetHeight,
  (newVal) => {
    if (!props.animate) {
      animatedHeight.value = newVal;
    }
  }
);

const tooltip = computed(() => props.value);
</script>

<style scoped>
.vertical-bar-container {
  height: 100px;
  width: 1.25rem;
  display: flex;
  align-items: flex-end;
  background: rgba(255,255,255,0.05);
  border-radius: 0.25rem 0.25rem 0 0;
  flex-direction: column;
  justify-content: flex-end;
}
.vertical-bar {
  width: 100%;
  min-height: 4px;
  border-radius: 0.25rem 0.25rem 0 0;
  background: #2563eb;
  transition: height 0.5s cubic-bezier(0.4,0,0.2,1);
}
</style>
