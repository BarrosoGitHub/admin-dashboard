<template>
  <div class="bg-website-color min-h-screen w-full flex items-center justify-center relative">
    <div ref="vantaRef" class="absolute inset-0 w-full h-full z-0"></div>
    <div
      v-if="!fadeInBgDone"
      class="absolute inset-0 w-full h-full z-10 bg-website-color bg-opacity-90 fade-bg-in"
    ></div>
    <div
      v-if="isFadingOut"
      class="absolute inset-0 w-full h-full z-10 bg-website-color bg-opacity-90 fade-bg"
    ></div>
    <div
      class="absolute inset-0 flex items-center justify-center z-20 custom-blur"
      :class="{ 'fade-out': isFadingOut }"
    >
      <div
        class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 bg-modal-color border-color shadow-md"
      >
        <!-- Petrotec Icon at the top center -->
        <div class="flex justify-center -translate-y-5">
          <img
            :src="petrotecIcon"
            alt="Petrotec Icon"
            class="h-16 w-auto"
          />
        </div>
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
          <div>
            <label
              for="username"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Username</label
            >
            <input
              type="text"
              name="username"
              id="username"
              v-model="username"
              class="text-gray-900 text-sm rounded-sm border input-border-color block w-full p-2.5 pl-5 bg-input-color dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Your password</label
            >
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              placeholder="••••••••"
              class="text-gray-900 text-sm rounded-sm border input-border-color block w-full p-2.5 pl-5 bg-input-color dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login to your account
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import petrotecIcon from '@/assets/Petrotec-icon.png';
import axios from 'axios';
import { useRouter } from 'vue-router';

const fadeIn = ref(false);
const isFadingOut = ref(false);
const vantaRef = ref(null);
let vantaEffect = null;

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const fadeInBgDone = ref(false);

let vantaTargetPoints = 30;
let vantaTargetMaxDist = 30;
let vantaAnimFrame = null;

function animateVantaReduction() {
  if (vantaEffect) {
    let currPoints = vantaEffect.options.points;
    let currMaxDist = vantaEffect.options.maxDistance;
    let changed = false;
    if (currPoints > 0) {
      currPoints = Math.max(0, currPoints - 1.5);
      vantaEffect.setOptions({ points: currPoints });
      changed = true;
    }
    if (currMaxDist > 0) {
      currMaxDist = Math.max(0, currMaxDist - 2);
      vantaEffect.setOptions({ maxDistance: currMaxDist });
      changed = true;
    }
    if (changed) {
      vantaAnimFrame = requestAnimationFrame(animateVantaReduction);
    }
  }
}

onMounted(async () => {
  setTimeout(() => {
    fadeIn.value = true;
    setTimeout(() => {
      fadeInBgDone.value = true;
    }, 200); // Match fade-in duration
  }, 50);

  // Dynamically load three.js and vanta.net
    if (!window.THREE) {
    await new Promise(resolve => {
      const script = document.createElement('script');
      script.src = '/three.min.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }
  if (!window.VANTA || !window.VANTA.NET) {
    await new Promise(resolve => {
      const script = document.createElement('script');
      script.src = '/vanta.net.min.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }
  if (window.VANTA && window.VANTA.NET && vantaRef.value) {
    vantaEffect = window.VANTA.NET({
      el: vantaRef.value,
      mouseControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x248538,
      backgroundColor: 0x212121,
      points: 3,
      maxDistance: 35,
      spacing: 25
    });
  }
});

onBeforeUnmount(() => {
  if (vantaEffect && vantaEffect.destroy) vantaEffect.destroy();
  if (vantaAnimFrame) cancelAnimationFrame(vantaAnimFrame);
});

// --- JWT login logic ---
async function handleLogin() {
  error.value = '';
  try {
    const response = await axios.post('http://localhost:5087/auth/login', {
      username: username.value,
      password: password.value,
    });
    console.log(response.data);

    const token = response.data.Token;
    localStorage.setItem('jwt', token);

    const validateResp = await axios.get(
      `http://localhost:5087/auth/validate?token=${encodeURIComponent(token)}`
    );

    if (validateResp.status === 200) {
      isFadingOut.value = true;
      if (vantaEffect) {
        vantaAnimFrame = requestAnimationFrame(animateVantaReduction);
      }
      setTimeout(() => {
        router.push('/home');
      }, 500); // Match the transition duration
    } else {
      error.value = 'Token validation failed.';
      localStorage.removeItem('jwt');
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
    localStorage.removeItem('jwt');
  }
}
</script>

<style>
.glow-animation {
  filter: drop-shadow(0 0 32px #38f862) drop-shadow(0 0 64px #38f882);
  opacity: 0;
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-in {
  opacity: 1;
}
.fade-out {
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.fade-bg {
  animation: fadeInBg 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.fade-bg-in {
  animation: fadeOutBg 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes fadeInBg {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOutBg {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
