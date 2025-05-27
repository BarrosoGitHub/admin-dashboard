<template>
    <form>
        
            <div>
                <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
                <div class="grid gap-6 mb-6 shadow-md rounded-full">
                <input
                    type="text"
                    id="first_name"
                    class="bg-gray-50 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    :placeholder="placeholder"
                    :value="modelValue"
                    @input="emit('update:modelValue', $event.target.value)"
                    required
                />
            </div>
        </div>
    </form>
</template>

<script setup>
    import { defineProps } from 'vue'

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
    }})
    
    const emit = defineEmits(['update:modelValue'])
    const label = props.label
    const placeholder = props.placeholder
</script>