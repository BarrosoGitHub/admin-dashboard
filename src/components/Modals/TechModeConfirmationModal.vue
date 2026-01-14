<template>
  <transition name="fade-slide">
    <div
      v-if="show"
      class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-neutral-950/35 backdrop-blur-md shadow-xl"
      style="pointer-events: auto"
    >
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div
          class="relative bg-white rounded-lg shadow-sm bg-modal-color border border-color"
        >
          <button
            type="button"
            class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl font-bold focus:outline-none"
            @click="cancel"
            :disabled="isLoading"
            aria-label="Close"
          >
            &times;
          </button>
          <div class="p-4 md:p-5 text-left text-sm text-gray-800 dark:text-gray-200">
            <div class="flex items-center mb-4">
              <svg
                class="w-10 h-10 text-yellow-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <h3 class="text-lg font-bold">Confirm Tech Mode Change</h3>
            </div>
            <p class="mb-4">
              {{ enabling ? "Enabling" : "Disabling" }} Tech Mode will reboot the system.
              This action will interrupt any ongoing operations.
            </p>
            <p class="text-yellow-600 dark:text-yellow-400 font-semibold mb-4">
              Are you sure you want to continue?
            </p>
            <div class="mt-6 flex flex-row justify-end gap-2">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                @click="cancel"
                :disabled="isLoading"
              >
                Cancel
              </button>
              <ButtonConfirmation
                :label="'Confirm'"
                :isLoading="isLoading"
                :showTick="showTick"
                :showError="showError"
                @confirm="confirm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Rebooting Overlay -->
  <transition name="reboot-fade">
    <div
      v-if="isRebooting"
      class="fixed top-0 right-0 left-0 z-[9999] flex flex-col justify-center items-center w-full h-full"
      style="pointer-events: auto"
    >
      <!-- Animated dots background -->
      <canvas
        ref="rebootBgCanvas"
        class="absolute inset-0 w-full h-full z-[1] canvas-blur"
      ></canvas>

      <!-- Content -->
      <div class="flex flex-col items-center relative z-[2] reboot-content">
        <Vue3Lottie
          :animationData="petrotecAnimation"
          :height="animationSize"
          :width="animationSize"
          :loop="true"
          :autoPlay="true"
          :speed="1.3"
          :background-color="'transparent'"
          style="background: transparent"
        />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Vue3Lottie } from "vue3-lottie";
import petrotecAnimation from "@/assets/Petrotec-loading.json";
import { API_BASE_URL } from "../../apiConfig";
import ButtonConfirmation from "./ButtonConfirmation.vue";

const show = ref(false);
const enabling = ref(false);
const isLoading = ref(false);
const showTick = ref(false);
const showError = ref(false);
const isRebooting = ref(false);
const rebootBgCanvas = ref(null);
const animationSize = ref(350);

const emit = defineEmits(["confirmed", "cancelled", "systemOnline"]);

let resolveCallback = null;
let rejectCallback = null;
let checkAliveInterval = null;

function open(isEnabling) {
  show.value = true;
  enabling.value = isEnabling;
  isLoading.value = false;
  showTick.value = false;
  showError.value = false;

  return new Promise((resolve, reject) => {
    resolveCallback = resolve;
    rejectCallback = reject;
  });
}

function confirm() {
  isLoading.value = true;
  if (resolveCallback) {
    resolveCallback(true);
  }
  emit("confirmed");
}

function cancel() {
  if (!isLoading.value) {
    show.value = false;
    if (rejectCallback) {
      rejectCallback(false);
    }
    emit("cancelled");
  }
}

function setSuccess() {
  isLoading.value = false;
  showTick.value = true;
  setTimeout(() => {
    show.value = false;
    showTick.value = false;
  }, 1500);
}

function setError() {
  isLoading.value = false;
  showError.value = true;
  setTimeout(() => {
    showError.value = false;
  }, 2000);
}

function startRebootMonitoring() {
  // Close the confirmation modal
  show.value = false;

  // Show rebooting overlay
  isRebooting.value = true;

  // Start checking if system is alive every second
  checkAliveInterval = setInterval(async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${API_BASE_URL}/info/services/isalive`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // System is back online
        clearInterval(checkAliveInterval);
        checkAliveInterval = null;
        isRebooting.value = false;
        emit("systemOnline");
        console.log("System is back online");
      }
    } catch (error) {
      // System is still rebooting, continue checking
      console.log("System still rebooting...");
    }
  }, 1000); // Check every 1 second
}

function stopRebootMonitoring() {
  if (checkAliveInterval) {
    clearInterval(checkAliveInterval);
    checkAliveInterval = null;
  }
  isRebooting.value = false;
}

// Animation variables
let animationId = null;
let ctx,
  width,
  height,
  points,
  target,
  animateHeader = true;
const DOTS_PER_ROW = 20;
const DOT_SIZE_MIN = 2;
const DOT_SIZE_MAX = 4;
const DOT_SPACING_FACTOR = 1;
const FADE_RADIUS = 2.5;

function getDistance(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function Circle(pos, rad) {
  this.pos = pos;
  this.radius = rad;
  this.baseRadius = rad;
  this.active = 0;
  this.pulsePhase = Math.random() * Math.PI * 2;
  this.pulseAmount = 0.15 + Math.random() * 0.5;
  this.draw = function () {
    if (!this.active) return;
    const velocityFactor = Math.min(1, this.pos.velocity / 2);
    const pulse = Math.sin(this.pulsePhase) * velocityFactor;
    const currentRadius = this.baseRadius * (1 + pulse * this.pulseAmount);
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, currentRadius, 0, 2 * Math.PI, false);
    const depthOpacity = this.active * (0.5 + 0.5 * this.pos.z);
    ctx.fillStyle = `rgba(36,132,55,${depthOpacity})`;
    ctx.fill();
  };
}

function drawLines(p) {
  if (!p.active) return;
  for (let i in p.closest) {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.closest[i].x, p.closest[i].y);
    const avgZ = (p.z + p.closest[i].z) / 2;
    const depthOpacity = p.active * (0.5 + 0.5 * avgZ);
    ctx.strokeStyle = `rgba(36,132,55,${depthOpacity})`;
    ctx.stroke();
  }
}

function shiftPoint(p) {
  const duration = 3500 + 2500 * Math.random();
  const startX = p.x;
  const startY = p.y;
  const moveRange = 100 * p.z;
  const endX = p.originX - moveRange / 2 + Math.random() * moveRange;
  const endY = p.originY - moveRange / 2 + Math.random() * moveRange;
  const startTime = performance.now();

  function animateShift(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const ease =
      t < 0.5
        ? (1 - Math.sqrt(1 - 2 * t * (2 * t))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
    p.x = startX + (endX - startX) * ease;
    p.y = startY + (endY - startY) * ease;
    if (t < 1 && isRebooting.value) {
      requestAnimationFrame(animateShift);
    } else if (isRebooting.value) {
      p.x = endX;
      p.y = endY;
      shiftPoint(p);
    }
  }
  requestAnimationFrame(animateShift);
}

function initRebootAnimation() {
  if (!rebootBgCanvas.value) return;

  width = window.innerWidth;
  height = window.innerHeight;

  // Calculate animation size based on window dimensions (25% of smaller dimension)
  const minDimension = Math.min(width, height);
  animationSize.value = Math.max(200, Math.min(500, minDimension * 0.25));

  target = { x: width * 0.5, y: height * 0.5 };
  rebootBgCanvas.value.width = width;
  rebootBgCanvas.value.height = height;
  ctx = rebootBgCanvas.value.getContext("2d");
  points = [];

  const dotsPerRow = Math.max(1, Math.floor(DOTS_PER_ROW * (width / 1920)));
  const spacing = (width / dotsPerRow) * DOT_SPACING_FACTOR;

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      let px = x + Math.random() * spacing;
      let py = y + Math.random() * spacing;
      let pz = 0.4 + Math.random() * 0.6;
      let p = {
        x: px,
        originX: px,
        y: py,
        originY: py,
        z: pz,
        prevX: px,
        prevY: py,
        velocity: 0,
      };
      points.push(p);
    }
  }

  for (let i = 0; i < points.length; i++) {
    let closest = [];
    let p1 = points[i];
    for (let j = 0; j < points.length; j++) {
      let p2 = points[j];
      if (p1 !== p2) {
        let placed = false;
        for (let k = 0; k < 5; k++) {
          if (!placed) {
            if (!closest[k]) {
              closest[k] = p2;
              placed = true;
            }
          }
        }
        for (let k = 0; k < 5; k++) {
          if (!placed) {
            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
              closest[k] = p2;
              placed = true;
            }
          }
        }
      }
    }
    p1.closest = closest;
  }

  for (let i in points) {
    const baseSize = DOT_SIZE_MIN + Math.random() * (DOT_SIZE_MAX - DOT_SIZE_MIN);
    const scaledSize = baseSize * points[i].z;
    let c = new Circle(points[i], scaledSize);
    points[i].circle = c;
  }

  for (let i in points) {
    shiftPoint(points[i]);
  }

  animate();
}

function animate() {
  if (!isRebooting.value || !ctx) return;

  ctx.clearRect(0, 0, width, height);
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#1a1a1a");
  grad.addColorStop(1, "#252525");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const activeDistance = 720000 * DOT_SPACING_FACTOR * FADE_RADIUS;

  for (let i in points) {
    const dx = points[i].x - points[i].prevX;
    const dy = points[i].y - points[i].prevY;
    points[i].velocity = Math.sqrt(dx * dx + dy * dy);

    if (points[i].velocity > 0.01) {
      points[i].circle.pulsePhase += points[i].velocity * 0.1;
    }

    points[i].prevX = points[i].x;
    points[i].prevY = points[i].y;

    const dist = Math.abs(getDistance(target, points[i]));
    const fade = Math.max(0, 1 - dist / activeDistance);
    points[i].active = 0.3 * Math.pow(fade, 1.5);
    points[i].circle.active = 0.6 * Math.pow(fade, 1.5);
    drawLines(points[i]);
    points[i].circle.draw();
  }

  animationId = requestAnimationFrame(animate);
}

function cleanupAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  animateHeader = false;
}

watch(isRebooting, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      initRebootAnimation();
    }, 100);
  } else {
    cleanupAnimation();
  }
});

onBeforeUnmount(() => {
  cleanupAnimation();
  if (checkAliveInterval) {
    clearInterval(checkAliveInterval);
  }
});

defineExpose({ open, setSuccess, setError, startRebootMonitoring, stopRebootMonitoring });
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}

.fade-slide-enter-active .relative.p-4 {
  animation: slide-down 0.3s ease;
}

.fade-slide-leave-active .relative.p-4 {
  animation: slide-up 0.3s ease;
}

@keyframes slide-down {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-50px);
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Reboot screen smooth transitions */
.reboot-fade-enter-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.reboot-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.reboot-fade-enter-from {
  opacity: 0;
}

.reboot-fade-enter-to {
  opacity: 1;
}

.reboot-fade-leave-from {
  opacity: 1;
}

.reboot-fade-leave-to {
  opacity: 0;
}

/* Content animation */
.reboot-fade-enter-active .reboot-content {
  animation: reboot-scale-in 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.reboot-fade-leave-active .reboot-content {
  animation: reboot-scale-out 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes reboot-scale-in {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes reboot-scale-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.8);
    opacity: 0;
  }
}

/* Canvas blur effect */
.canvas-blur {
  filter: blur(4px);
}
</style>
