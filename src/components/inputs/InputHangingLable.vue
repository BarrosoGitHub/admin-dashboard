<template>
  <div class="relative w-full">
    <template v-if="type === 'select' && options">
      <div class="relative">
        <select
          :id="inputId"
          class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 input-border-color appearance-none dark:text-white border-color focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-8 text-left"
          :value="modelValue"
          @change="emit('update:modelValue', $event.target.value)"
          required
        >
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <!-- Custom arrow icon for select -->
        <svg class="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <label :for="inputId" class="absolute text-sm text-neutral-300 dark:text-neutral-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-label-color px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
          {{ label }}
        </label>
      </div>
    </template>
    <template v-else>
      <input
        :type="type"
        :id="inputId"
        class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-neutral-900 bg-transparent rounded-lg border-1 input-border-color appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer text-left"
        :placeholder="placeholder"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        required
      />
      <label :for="inputId" class="absolute text-sm text-neutral-500 dark:text-neutral-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-label-color px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
        {{ label }}
      </label>
    </template>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Property'
  },
  placeholder: {
    type: String,
    default: 'Value'
  },
  modelValue: {
    type: [String, Number, Boolean, Object, Array, null],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  id: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue'])
const inputId = computed(() => props.id || 'input_' + Math.random().toString(36).substr(2, 9))
</script>

<style scoped>
.bg-label-color {
  background-color: #363636 !important;
}
/* No additional styles needed, all handled by utility classes */
</style>
