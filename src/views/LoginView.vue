<template>
  <div class="min-h-screen w-full flex items-center justify-center relative">
    <canvas ref="headerBgCanvas" class="absolute inset-0 w-full h-full z-0"></canvas>
    <div
      class="absolute inset-0 flex items-center justify-center z-20"
    >
      <div
        class="w-full max-w-lg p-4 rounded-lg sm:p-6 md:p-8 modal-fadein "
        :class="{ 'modal-fadein-active': modalVisible, 'modal-fadeout': modalFadingOut }"
      >
        <!-- Login instructions -->
        <div class="mb-15 mt-2 flex flex-col items-center gap-1">
          <div class="text-4xl font-bold text-neutral-100 whitespace-nowrap">{{ typedText }}<span class="typing-cursor" v-if="isTyping">|</span></div>
        </div>
        <form class="space-y-10" @submit.prevent="handleLogin" @keydown.enter="handleLogin">
          <div 
            class="input-field-container input-grow"
            :class="{ 'input-slide-down': loginShowTick }"
          >
            <input
              type="text"
              name="username"
              id="username"
              v-model="username"
              class="text-gray-300 text-sm block w-full p-2.5 pl-5 bg-transparent border-0 border-b-2 border-gray-400 focus:border-blue-500 outline-none shadow-none rounded-none transition-colors duration-200 dark:placeholder-gray-400 dark:text-white autofill:shadow-none autofill:bg-transparent autofill:border-b-2 autofill:border-gray-400"
              placeholder="Please Input Username"
              required
              @input="userInteracted = true"
              @focus="userInteracted = true"
              @keydown.enter="handleLogin"
            />
          </div>
          <div 
            class="input-field-container input-grow input-grow-delay"
            :class="{ 'input-slide-down': loginShowTick }"
          >
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              placeholder="Please Input Password"
              class="text-gray-300 text-sm block w-full p-2.5 pl-5 bg-transparent border-0 border-b-2 border-gray-400 focus:border-blue-500 outline-none shadow-none rounded-none transition-colors duration-200 dark:placeholder-gray-400 dark:text-white autofill:shadow-none autofill:bg-transparent autofill:border-b-2 autofill:border-gray-400"
              required
              @input="userInteracted = true"
              @focus="userInteracted = true"
              @keydown.enter="handleLogin"
            />
          </div>
          <div 
            class="flex justify-center button-container"
            :class="{ 'button-slide-up': loginShowTick }"
          >
            <ButtonConfirmation
              :label="'Authenticate'"
              :isLoading="loginLoading"
              :showTick="loginShowTick"
              :showError="loginShowError"
              :disabled="!username || !password || !userInteracted || loginLoading"
              @confirm="handleLogin"
            />
          </div>
        </form>
        
      </div>
    </div>
    <!-- Petrotec Icon at the bottom center -->
    <div class="flex justify-center items-end" style="position: absolute; left: 0; right: 0; bottom: 40px; width: 100%;">
      <img
        :src="petrotecIcon"
        alt="Petrotec Icon"
        class="h-16 w-auto"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import petrotecIcon from '@/assets/Petrotec-icon.png';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { API_BASE_URL } from '@/apiConfig.js';
import ButtonConfirmation from '@/components/Modals/ButtonConfirmation.vue';

const fadeIn = ref(false);
const headerBgCanvas = ref(null);

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const modalVisible = ref(false);
const modalFadingOut = ref(false);
const loginLoading = ref(false);
const loginShowTick = ref(false);
const loginShowError = ref(false);
const typedText = ref('');
const isTyping = ref(true);
const userInteracted = ref(false); // Track if user has actually typed

const anchorPosX = 0.9; // Anchor at 90% of the screen width
const anchorPosY = 0.5; // Anchor at 50% of the screen height

// === Global Animation Settings ===
const DOTS_PER_ROW = 25; // Lower = wider, higher = denser
const DOT_SIZE_MIN = 2;
const DOT_SIZE_MAX = 4;
const DOT_SPACING_FACTOR = 1; // 1 = normal, >1 = wider

// === Fade effect global settings ===
const FADE_RADIUS = 2.3; // Multiplier for fade radius (default 2)

const ACTIVE_DISTANCE = 720000 * DOT_SPACING_FACTOR * FADE_RADIUS; // Use only one distance for smooth fade
// ================================

// --- Tympanus AnimatedHeaderBackgrounds 'Lines' effect (faithful port) ---
let animationId = null;
let ctx, width, height, points, target, animateHeader = true;
let fadeRadiusAnim = 0; // For animated fade radius
let fadeRadiusStartTime = null;
let cachedScaleFactor = 1; // Cache diagonal scale factor for performance
const FADE_RADIUS_ANIM_DURATION = 700; // ms
const REFERENCE_DIAGONAL = Math.sqrt(1920 * 1920 + 1080 * 1080); // Pre-calculate reference

function getDistance(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function Circle(pos, rad, color) {
  this.pos = pos;
  this.radius = rad;
  this.color = color;
  this.active = 0;
  this.draw = function () {
    if (!this.active) return;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(36,132,55,${this.active})`;
    ctx.fill();
  };
}

function drawLines(p) {
  if (!p.active) return;
  for (let i in p.closest) {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.closest[i].x, p.closest[i].y);
    ctx.strokeStyle = `rgba(36,132,55,${p.active})`;
    ctx.stroke();
  }
}

function shiftPoint(p) {
  // Make animation a bit slower: increase duration
  const duration = 3500 + 2500 * Math.random(); // 3.5s to 6s
  const startX = p.x;
  const startY = p.y;
  const endX = p.originX - 50 + Math.random() * 100;
  const endY = p.originY - 50 + Math.random() * 100;
  const startTime = performance.now();

  function animateShift(now) {
    const t = Math.min(1, (now - startTime) / duration);
    // Circ.easeInOut approximation
    const ease = t < 0.5 ? (1 - Math.sqrt(1 - (2 * t) * (2 * t))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
    p.x = startX + (endX - startX) * ease;
    p.y = startY + (endY - startY) * ease;
    if (t < 1) {
      requestAnimationFrame(animateShift);
    } else {
      p.x = endX;
      p.y = endY;
      shiftPoint(p);
    }
  }
  requestAnimationFrame(animateShift);
}

function initHeader() {
  width = window.innerWidth;
  height = window.innerHeight;
  // Cache scale factor calculation for performance
  const currentDiagonal = Math.sqrt(width * width + height * height);
  cachedScaleFactor = currentDiagonal / REFERENCE_DIAGONAL;
  // Anchor at x=90% and y=50% of the screen on init
  target = { x: width * anchorPosX, y: height * anchorPosY };
  headerBgCanvas.value.width = width;
  headerBgCanvas.value.height = height;
  points = [];
  // Calculate dots per row based on screen width for responsive density
  const dotsPerRow = Math.max(1, Math.floor(DOTS_PER_ROW * (width / 1920)));
  const spacing = width / dotsPerRow * DOT_SPACING_FACTOR;
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      let px = x + Math.random() * spacing;
      let py = y + Math.random() * spacing;
      let p = { x: px, originX: px, y: py, originY: py };
      points.push(p);
    }
  }
  // Find the 5 closest points for each point
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
  // Assign a circle to each point
  for (let i in points) {
    let c = new Circle(points[i], DOT_SIZE_MIN + Math.random() * (DOT_SIZE_MAX - DOT_SIZE_MIN), 'rgba(156,217,249,0.3)');
    points[i].circle = c;
  }
  // Start shifting points
  for (let i in points) {
    shiftPoint(points[i]);
  }
}

function animate(now) {
  if (fadeRadiusStartTime === null) fadeRadiusStartTime = now;
  // Animate fade radius from 0 to FADE_RADIUS
  const t = Math.min(1, (now - fadeRadiusStartTime) / FADE_RADIUS_ANIM_DURATION);
  fadeRadiusAnim = FADE_RADIUS * t;
  if (animateHeader) {
    ctx.clearRect(0, 0, width, height);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#212121');
    grad.addColorStop(1, '#272727');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    // Use cached scale factor for better performance
    const scaledFadeRadius = FADE_RADIUS * cachedScaleFactor/3;
    const activeDistance = 720000 * DOT_SPACING_FACTOR * (scaledFadeRadius * fadeRadiusAnim);
    for (let i in points) {
      const dist = Math.abs(getDistance(target, points[i]));
      const fade = Math.max(0, 1 - dist / activeDistance);
      points[i].active = 0.3 * Math.pow(fade, 1.5);
      points[i].circle.active = 0.6 * Math.pow(fade, 1.5);
      drawLines(points[i]);
      points[i].circle.draw();
    }
  }
  animationId = requestAnimationFrame(animate);
}

function mouseMove(e) {
  let posx = 0, posy = 0;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  // Anchor the background animation to x=90% and y=50% of the screen
  target.x = window.innerWidth * anchorPosX;
  target.y = window.innerHeight * anchorPosY;
}

function scrollCheck() {
  if (document.body.scrollTop > height) animateHeader = false;
  else animateHeader = true;
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  target.x = width * anchorPosX;
  target.y = height * anchorPosY;
  headerBgCanvas.value.width = width;
  headerBgCanvas.value.height = height;
  initHeader();
}

function addListeners() {
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('scroll', scrollCheck);
  window.addEventListener('resize', resize);
}

function removeListeners() {
  window.removeEventListener('mousemove', mouseMove);
  window.removeEventListener('scroll', scrollCheck);
  window.removeEventListener('resize', resize);
}

onMounted(() => {
  // Typing effect for credentials text
  setTimeout(() => {
    startTypingEffect('Enter your credentials');
  }, 300);
  
  if (headerBgCanvas.value) {
    ctx = headerBgCanvas.value.getContext('2d');
    initHeader();
    addListeners();
    animateHeader = true;
    fadeRadiusAnim = 0;
    fadeRadiusStartTime = null;
    requestAnimationFrame(animate);
  }
  setTimeout(() => { modalVisible.value = true; }, 10);
});

onBeforeUnmount(() => {
  animateHeader = false;
  if (animationId) cancelAnimationFrame(animationId);
  removeListeners();
});

// Typing effect function
function startTypingEffect(text, callback) {
  typedText.value = '';
  isTyping.value = true;
  let charIndex = 0;
  const typeSpeed = 25; // Even faster typing speed
  
  const typeText = () => {
    if (charIndex < text.length) {
      typedText.value = text.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typeText, typeSpeed);
    } else {
      isTyping.value = false;
      if (callback) callback();
    }
  };
  
  typeText();
}

// Delete effect function (backspace animation)
function startDeleteEffect(callback) {
  isTyping.value = true;
  const deleteSpeed = 1; // Even faster delete speed
  
  const deleteText = () => {
    if (typedText.value.length > 0) {
      typedText.value = typedText.value.substring(0, typedText.value.length - 1);
      setTimeout(deleteText, deleteSpeed);
    } else {
      if (callback) callback();
    }
  };
  
  deleteText();
}

// --- JWT login logic ---
async function handleLogin() {
  error.value = '';
  loginLoading.value = true;
  loginShowTick.value = false;
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: username.value,
      password: password.value,
    });
    console.log(response.data);

    const token = response.data.Token;
    localStorage.setItem('jwt', token);

    const validateResp = await axios.get(
      `${API_BASE_URL}/auth/validate?token=${encodeURIComponent(token)}`
    );

    if (validateResp.status === 200) {
      // Set flag to show dashboard after login
      localStorage.setItem('showDashboardOnHome', 'true');
      console.log('Login successful!');
      loginLoading.value = false;
      loginShowTick.value = true;
      
      // Delete current text, then type "Authenticated successfully"
      setTimeout(() => {
        startDeleteEffect(() => {
          startTypingEffect('Authenticated successfully');
        });
      }, 100);
      
      setTimeout(() => {
        modalFadingOut.value = true;
        // Animate the background anchor moving off-screen to the right for fade-out effect
        const startX = target.x;
        const endX = window.innerWidth * 2;
        const duration = 350; // match modal fade duration
        const startTime = performance.now();
        function animateAnchor(now) {
          const t = Math.min(1, (now - startTime) / duration);
          target.x = startX + (endX - startX) * t;
          if (t < 1) {
            requestAnimationFrame(animateAnchor);
          }
        }
        requestAnimationFrame(animateAnchor);
        setTimeout(() => {
          router.push('/home');
        }, 350); // match fade duration
      }, 1800); // Wait longer for typing animation to complete
    } else {
      error.value = 'Token validation failed.';
      localStorage.removeItem('jwt');
      loginLoading.value = false;
      loginShowTick.value = false;
      loginShowError.value = true;
      
      // Show "Login failed" then revert back to "Enter your credentials"
      startDeleteEffect(() => {
        startTypingEffect('Login failed', () => {
          setTimeout(() => {
            loginShowError.value = false;
            startDeleteEffect(() => {
              startTypingEffect('Enter your credentials');
            });
          }, 1500);
        });
      });
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
    localStorage.removeItem('jwt');
    loginLoading.value = false;
    loginShowTick.value = false;
    loginShowError.value = true;
    
    // Show "Login failed" then revert back to "Enter your credentials"
    startDeleteEffect(() => {
      startTypingEffect('Login failed', () => {
        setTimeout(() => {
          loginShowError.value = false;
          startDeleteEffect(() => {
            startTypingEffect('Enter your credentials');
          });
        }, 1500);
      });
    });
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9fafb;
  color: #111827;
}

.bg-modal-color {
  background-color: #ffffff;
}

.input-border-color {
  border-color: #d1d5db;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

canvas[ref="headerBgCanvas"] {
  background: transparent;
  display: block;
}

input:-webkit-autofill,
input:-webkit-autofill:focus,
input:-webkit-autofill:hover,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
  box-shadow: 0 0 0 1000px transparent inset !important;
  background-color: transparent !important;
  border-bottom: 2px solid #9ca3af !important;
  color-scheme: dark;
  -webkit-text-fill-color: inherit !important;
  transition: background-color 9999s ease-in-out 0s;
}

.modal-fadein {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1);
}
.modal-fadein-active {
  opacity: 1;
  transform: translateY(0);
}
.modal-fadeout {
  opacity: 0 !important;
  transform: translateY(32px) !important;
  pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1);
}

.typing-cursor {
  animation: blink 1s infinite;
  color: #248437;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.input-field-container {
  transition: transform 0.4s cubic-bezier(0.9,0,0.2,0.01), opacity 0.4s cubic-bezier(0.4,0,0.2,1);
}

.input-grow {
  animation: growWidth 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  transform: scaleX(0);
  transform-origin: center;
}

.input-grow-delay {
  animation-delay: 0.15s;
}

@keyframes growWidth {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

.input-slide-down {
  transform: translateY(60px) !important;
  opacity: 0 !important;
  animation: none !important;
}

.button-container {
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
}

.button-slide-up {
  transform: translateY(-100px);
}
</style>
