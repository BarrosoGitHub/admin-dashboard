<template>
  <transition name="fade-slide">
    <div
      v-if="show"
      class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-neutral-900/35 backdrop-blur-md"
      style="pointer-events: auto"
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-modal-color rounded-2xl shadow-inner">
          <div
            class="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-neutral-600 border-gray-200"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white px-1">
              Change Password
            </h3>
            <div class="relative top-2 left-2 ">
                <div class="flex justify-center relative">
                  <div class="relative group">
                    <svg 
                      class="w-8 h-8 transition-all duration-300 cursor-pointer" 
                      :class="form.newPassword ? passwordStrengthColor : 'text-gray-500'"
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                      @click="form.newPassword ? togglePasswordTips() : null"
                    >
                      <!-- Key circular head -->
                      <circle cx="7" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
                      <circle cx="7" cy="7" r="1.5"/>
                      
                      <!-- Key shaft -->
                      <rect x="10" y="6.2" width="8" height="1.6"/>
                      
                      <!-- Key teeth (strength indicators) - always visible -->
                      <g>
                        <rect x="15" y="7.8" width="1" height="2" :class="form.newPassword ? passwordStrengthColor.replace('text-', 'fill-') : 'fill-gray-500'"/>
                      </g>
                      <g>
                        <rect x="17" y="7.8" width="1" height="3" :class="form.newPassword ? passwordStrengthColor.replace('text-', 'fill-') : 'fill-gray-500'"/>
                      </g>
                      <g>
                        <rect x="16" y="7.8" width="1" height="1.5" :class="form.newPassword ? passwordStrengthColor.replace('text-', 'fill-') : 'fill-gray-500'"/>
                      </g>
                    </svg>
                    
                    <!-- Hover Tooltip -->
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      <span v-if="form.newPassword">
                        Password Strength: <span :class="passwordStrengthTextColor">{{ passwordStrengthText }}</span>
                      </span>
                      <span v-else class="text-gray-300">
                        Enter a password to see strength
                      </span>
                      <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
            </div>
            <button
              type="button"
              class="end-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              @click="closeModal"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="p-4 md:px-5 py-6">
            <form class="space-y-6" @submit.prevent="handleSubmit">
              <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
              <div v-if="success" class="text-green-500 text-sm text-center">{{ success }}</div>
              
              <div class="relative w-full">
                <input
                  type="password"
                  id="currentPassword"
                  v-model="form.currentPassword"
                  class="peer text-neutral-400 text-sm block w-full p-2.5 pr-2 pl-32 bg-transparent border-0 border-b-2 border-neutral-600 focus:border-blue-500 outline-none shadow-none rounded-none transition-colors duration-200 dark:placeholder-gray-400 text-right"
                  placeholder="••••••••"
                  required
                />
                <span class="absolute left-0 bottom-3 text-neutral-100 text-sm pointer-events-none select-none px-2">
                  Current Password
                </span>
              </div>

              <div class="relative w-full">
                <input
                  type="password"
                  id="newPassword"
                  v-model="form.newPassword"
                  class="peer text-neutral-400 text-sm block w-full p-2.5 pr-2 pl-28 bg-transparent border-0 border-b-2 border-neutral-600 focus:border-blue-500 outline-none shadow-none rounded-none transition-colors duration-200 dark:placeholder-gray-400 text-right"
                  placeholder="••••••••"
                  required
                />
                <span class="absolute left-0 bottom-3 text-neutral-100 text-sm pointer-events-none select-none px-2">
                  New Password
                </span>
              </div>

              <div class="relative w-full">
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  class="peer text-neutral-400 text-sm block w-full p-2.5 pr-2 pl-32 bg-transparent border-0 border-b-2 border-neutral-600 focus:border-blue-500 outline-none shadow-none rounded-none transition-colors duration-200 dark:placeholder-gray-400 text-right"
                  placeholder="••••••••"
                  required
                />
                <span class="absolute left-0 bottom-3 text-neutral-100 text-sm pointer-events-none select-none px-2">
                  Confirm Password
                </span>
              </div>

              <!-- Password Strength Indicator - Always Visible -->
              <div class="mt-2">
                
                
                <!-- Password Tips Panel -->
                <div v-if="showPasswordTips && form.newPassword" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 border border-gray-600 z-50 shadow-lg">
                  <!-- Balloon arrow pointing down -->
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium text-gray-200">Tips to strengthen your password:</h4>
                    <button 
                      @click="showPasswordTips = false" 
                      class="text-gray-400 hover:text-gray-200 transition-colors ml-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <ul class="space-y-1 text-xs text-gray-300">
                    <li v-for="tip in passwordTips" :key="tip" class="flex items-start">
                      <svg class="w-3 h-3 mr-2 mt-0.5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                      <span>{{ tip }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex justify-center pt-4">
                <ButtonConfirmation
                  :label="'Update'"
                  :isLoading="isLoading"
                  :showTick="showTick"
                  :disabled="!isFormValid || isLoading"
                  @confirm="handleSubmit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/apiConfig.js';
import ButtonConfirmation from '@/components/Modals/ButtonConfirmation.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'success']);

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const error = ref('');
const success = ref('');
const isLoading = ref(false);
const showTick = ref(false);
const showPasswordTips = ref(false);

const isFormValid = computed(() => {
  return form.value.currentPassword && 
         form.value.newPassword && 
         form.value.confirmPassword &&
         form.value.newPassword === form.value.confirmPassword;
});

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.value.newPassword;
  if (!password) return 0;
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/[0-9]/.test(password)) score += 1; // numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // special characters
  
  return score;
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return 'Weak';
  if (strength <= 4) return 'Medium';
  return 'Strong';
});

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return 'text-red-500';
  if (strength <= 4) return 'text-yellow-500';
  return 'text-green-500';
});

const passwordStrengthTeethColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return 'fill-red-400';
  if (strength <= 4) return 'fill-yellow-400';
  return 'fill-green-400';
});

const passwordStrengthTextColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return 'text-red-400';
  if (strength <= 4) return 'text-yellow-400';
  return 'text-green-400';
});

const passwordStrengthWidth = computed(() => {
  const strength = passwordStrength.value;
  return `${Math.min(100, (strength / 6) * 100)}%`;
});

const passwordTips = computed(() => {
  const password = form.value.newPassword;
  const tips = [];
  
  if (!/[a-z]/.test(password)) {
    tips.push('Add lowercase letters (a-z)');
  }
  if (!/[A-Z]/.test(password)) {
    tips.push('Add uppercase letters (A-Z)');
  }
  if (!/[0-9]/.test(password)) {
    tips.push('Add numbers (0-9)');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    tips.push('Add special characters (!@#$%^&*)');
  }
  if (password.length < 12) {
    tips.push('Consider using 12+ characters for extra security');
  }
  
  return tips;
});

function togglePasswordTips() {
  showPasswordTips.value = !showPasswordTips.value;
}

// Watch for password mismatch
watch(() => [form.value.newPassword, form.value.confirmPassword], () => {
  if (form.value.confirmPassword && form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Passwords do not match';
  } else {
    error.value = '';
  }
});

// Reset form when modal opens/closes
watch(() => props.show, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

function resetForm() {
  form.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  error.value = '';
  success.value = '';
  isLoading.value = false;
  showTick.value = false;
  showPasswordTips.value = false;
}

function closeModal() {
  resetForm();
  emit('close');
}

async function handleSubmit() {
  if (!isFormValid.value) return;

  error.value = '';
  success.value = '';
  isLoading.value = true;
  showTick.value = false;

  try {
    const token = localStorage.getItem('jwt');
    
    await axios.post(`${API_BASE_URL}/auth/change-password`, {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    isLoading.value = false;
    showTick.value = true;
    success.value = 'Password changed successfully!';
    
    setTimeout(() => {
      emit('success');
      closeModal();
    }, 1500);

  } catch (err) {
    isLoading.value = false;
    showTick.value = false;
    error.value = err.response?.data?.message || 'Failed to change password. Please try again.';
  }
}
</script>

<style scoped>
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.bg-modal-color {
  background-color: #1f1f1f;
}

/* Auto-fill styling for password fields */
input:-webkit-autofill,
input:-webkit-autofill:focus,
input:-webkit-autofill:hover,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
  box-shadow: 0 0 0 1000px transparent inset !important;
  background-color: transparent !important;
  border-bottom: 2px solid #525252 !important;
  color-scheme: dark;
  -webkit-text-fill-color: #a3a3a3 !important;
  transition: background-color 9999s ease-in-out 0s;
}
</style>
