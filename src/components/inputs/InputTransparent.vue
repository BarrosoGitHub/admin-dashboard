<template>
  <div class="relative w-full">
    <template v-if="type === 'select' && options">
      <select
        :id="inputId"
        class="peer text-color-secondary text-sm block w-full p-2.5 pr-2 pl-28 bg-transparent border-b input-border-color outline-none shadow-none rounded-none transition-colors duration-200 dark:placeholder-gray-400 text-right"
        :value="modelValue"
        @change="emit('update:modelValue', $event.target.value)"
        required
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <span class="absolute left-0 bottom-2 text-color text-sm pointer-events-none select-none px-2">
        {{ label }}
      </span>
    </template>
    <template v-else>
      <input
        :type="type"
        :id="inputId"
        class="peer text-color-secondary text-sm block w-full p-2.5 pr-2 pl-28 bg-transparent border-b input-border-color outline-none shadow-none rounded-none transition-colors duration-200 dark:placeholder-gray-400 text-right"
        :placeholder="placeholder"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        required
      />
      <span class="absolute left-0 bottom-3 text-color text-sm pointer-events-none select-none px-2">
        {{ label }}
      </span>
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
input::placeholder {
  color: transparent;
}
select:invalid {
  color: gray;
}
input.input-border-color:focus, select.input-border-color:focus {
  border-color: var(--input-border-color-selected) !important;
}
input:focus, select:focus {
  color: var(--text-color) !important;
}

/* Dark mode dropdown options */
@media (prefers-color-scheme: dark) {
  select option {
    background-color: #4b4b4b; /* gray-700 */
    color: white;
  }
}
</style>
