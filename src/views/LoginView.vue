<template>
  <div class="bg-website-color min-h-screen w-full flex items-center justify-center relative">
    <dotlottie-player
      ref="lottie"
      class="blur-none glow-animation"
      :class="{ 'fade-in': fadeIn }"
      src="https://lottie.host/049c5461-1ede-40f0-9cdb-8cf785d082df/dVTgImPE9j.lottie"
      background="transparent"
      speed="1"
      style="width: 75vh; height: 75vh"
      loop
      @ready="handleLottieReady"
    ></dotlottie-player>
    <div class="absolute inset-0 flex items-center justify-center z-10 custom-blur">
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
      
        <form class="space-y-6" action="#">
      
          <div>
            <label
              for="Username"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Username</label
            >
            <input
              type="Username"
              name="username"
              id="username"
                    class=" text-gray-900 text-sm rounded-sm border input-border-color block w-full p-2.5 pl-5 bg-input-color dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              placeholder="••••••••"
                    class=" text-gray-900 text-sm rounded-sm border input-border-color block w-full p-2.5 pl-5 bg-input-color dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div class="flex items-start">
            <div class="flex items-start">
           
             
            </div>
           
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

const lottie = ref(null);
const fadeIn = ref(false);

let speed = 0.2;
let targetSpeed = 0.2;
const minSpeed = 0;
const maxSpeed = 1.0;
const acceleration = 0.2;
const deceleration = 0.03;
let lastMove = Date.now();
let rafId = null;

function setLottieSpeed(val) {
  if (lottie.value) {
    lottie.value.setSpeed(val);
    // Optionally pause when stopped for efficiency
    if (val === 0) lottie.value.pause();
    else lottie.value.play();
  }
}

function handleMouseMove() {
  lastMove = Date.now();
  targetSpeed = maxSpeed;
}

function animate() {
  // Accelerate or decelerate towards targetSpeed
  if (targetSpeed > speed) {
    speed = Math.min(targetSpeed, speed + acceleration);
  } else if (targetSpeed < speed) {
    speed = Math.max(targetSpeed, speed - deceleration);
  }

  setLottieSpeed(speed);

  // If no mouse movement for 100ms, decelerate to full stop
  if (Date.now() - lastMove > 100) {
    targetSpeed = minSpeed;
  }

  rafId = requestAnimationFrame(animate);
}

function handleLottieReady() {
  if (lottie.value) {
    lottie.value.play();
    setLottieSpeed(speed);
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  rafId = requestAnimationFrame(animate);
  // Trigger fade in
  setTimeout(() => {
    fadeIn.value = true;
  }, 50);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  if (rafId) cancelAnimationFrame(rafId);
});
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
</style>
