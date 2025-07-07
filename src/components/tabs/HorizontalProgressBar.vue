<template>
  <div class="text-xs font-medium text-color tr flex flex-row justify-between">
    <div class="px-2 capitalize ">
      {{ label.charAt(0).toUpperCase() + label.slice(1) }}:
    </div>
    <div class="w-30 rounded-full relative overflow-visible">
      <div
        class="bg-neutral-400 dark:bg-neutral-600 text-center p-0.5 leading-none rounded-full whitespace-nowrap absolute left-0 top-0 h-full flex items-center transition-all duration-300"
        :style="`width: ${animatedWidth}%;`"
      >
        <span class="pl-2 pr-2">
          {{ animatedDisplayValue }}<span v-if="props.type === 'ram'"> Mb</span><span v-else-if="props.type === 'cpu'"> °C</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
const props = defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
  type: {
    type: String,
    default: "other",
  },
  label: {
    type: String,
    default: "",
  },
  animate: {
    type: Boolean,
    default: false,
  },
  maxValue: {
    type: [String, Number],
    default: 100,
  },
});
const label = props.label || '';
const rawValue = computed(() => Number(String(props.value).replace(/[^\d.\-]/g, '')));
const maxValue = computed(() => Number(props.maxValue));
const animatedWidth = ref(0);
const animatedDisplayValue = ref(0);
let animationFrame;

function animateValue(from, to, duration = 300) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    animatedDisplayValue.value = (to * progress).toFixed(1);
    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    } else {
      animatedDisplayValue.value = to.toFixed(1);
    }
  }
  animationFrame = requestAnimationFrame(step);
}

watch(() => props.animate, (newVal) => {
  if (newVal) {
    animatedWidth.value = 0;
    animatedDisplayValue.value = 0;
    // Animate width
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const percent = Math.max(0, Math.min(100, (rawValue.value / maxValue.value) * 100));
        animatedWidth.value = percent;
        animateValue(0, rawValue.value);
      });
    });
  } else {
    animatedWidth.value = 0;
    animatedDisplayValue.value = 0;
    if (animationFrame) cancelAnimationFrame(animationFrame);
  }
}, { immediate: true });
</script>
