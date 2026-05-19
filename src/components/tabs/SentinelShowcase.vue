<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-3xl font-bold text-color">Sentinel</h2>
        <p class="text-gray-400 dark:text-gray-400 mt-2">Uptime monitoring & performance analytics platform</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Info button -->
        <div class="relative group">
          <button
            :class="['w-8 h-8 rounded-full border bg-modal-color-gradient text-sm font-bold flex items-center justify-center transition-all duration-200', infoBtnSeen ? 'border-color text-color hover:border-amber-400 hover:text-amber-300 hover:shadow-lg' : 'info-btn border-amber-500/60 text-amber-300 hover:border-amber-400 hover:shadow-[0_0_12px_2px_rgba(245,158,11,0.45)]']"
            @mouseenter="infoBtnSeen = true"
            @click="infoBtnSeen = true"
          >
            ?
          </button>
          <!-- ping ring -->
          <span v-if="!infoBtnSeen" class="absolute inset-0 rounded-full border border-amber-400/60 animate-ping pointer-events-none"></span>
          <!-- Tooltip -->
          <div class="absolute right-0 top-10 z-50 w-80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600/60 rounded-xl shadow-2xl p-4 text-left">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <span class="text-xs font-bold text-amber-600 dark:text-amber-300 uppercase tracking-widest">Portfolio Project</span>
              </div>
              <p class="text-sm text-gray-800 dark:text-gray-200 font-semibold mb-2">Sentinel — Uptime Monitor</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                Sentinel is a <span class="text-amber-600 dark:text-amber-300 font-medium">self-hosted monitoring platform</span> built to demonstrate a production-grade full-stack architecture — from scheduled background workers to a live WebSocket-powered dashboard.
              </p>
              <div class="space-y-2 border-t border-gray-200 dark:border-gray-700/60 pt-3">
                <div class="flex items-start gap-2">
                  <span class="text-amber-500 dark:text-amber-400 text-xs mt-0.5">▸</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400"><span class="text-gray-900 dark:text-gray-200 font-medium">Scheduler worker</span> — a node-cron process fans out concurrent HTTP probes on per-monitor intervals, storing results in a PostgreSQL time-series table.</p>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-amber-500 dark:text-amber-400 text-xs mt-0.5">▸</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400"><span class="text-gray-900 dark:text-gray-200 font-medium">Alert pipeline</span> — failures are pushed to a Redis-backed BullMQ queue, decoupling probe detection from webhook and email delivery with automatic retries.</p>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-amber-500 dark:text-amber-400 text-xs mt-0.5">▸</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400"><span class="text-gray-900 dark:text-gray-200 font-medium">Live dashboard</span> — the Vue 3 frontend subscribes to a WebSocket feed scoped per workspace, receiving status and latency updates with no polling.</p>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-amber-500 dark:text-amber-400 text-xs mt-0.5">▸</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400"><span class="text-gray-900 dark:text-gray-200 font-medium">One-command deploy</span> — a Docker Compose file orchestrates the API, scheduler, PostgreSQL, Redis, and nginx reverse-proxy as a reproducible stack.</p>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/60">
                <span class="text-xs text-gray-400 dark:text-gray-500 italic">Status board shown is a static mock for portfolio demonstration.</span>
              </div>
            </div>
            <!-- Arrow -->
            <div class="absolute -top-1.5 right-3 w-3 h-3 bg-white dark:bg-gray-900 border-l border-t border-gray-200 dark:border-gray-600/60 rotate-45"></div>
          </div>
        </div>
        <button
          @click="$emit('back')"
          class="px-4 py-2 bg-modal-color-gradient border border-color rounded-lg text-color hover:shadow-lg transition-all duration-200"
        >
          ← Back to Projects
        </button>
      </div>
    </div>

    <!-- Top row: About + Status board mock -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- About -->
      <div class="lg:col-span-2 bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-8 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-start gap-4 mb-6">
          <div class="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shrink-0">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-color mb-4">About the Project</h3>
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          <span class="font-semibold text-amber-500">Sentinel</span> is a self-hosted uptime and performance monitoring
          platform. It continuously pings registered endpoints on configurable intervals, records response times, and
          pushes <span class="font-semibold">live status updates</span> to every connected dashboard via WebSockets —
          no polling required.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          When a site goes down, Sentinel fires <span class="font-semibold">instant webhook &amp; email alerts</span> and
          logs the incident. A time-series view of response latency lets teams spot degradation before it becomes an
          outage. The entire stack — scheduler, API, and frontend — ships as a single
          <span class="font-semibold">Docker Compose</span> file, making it trivial to self-host.
        </p>

        <!-- Tech stack badges -->
        <div class="flex flex-wrap gap-2">
          <span class="showcase-tag bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25">Vue 3</span>
          <span class="showcase-tag bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25">TypeScript</span>
          <span class="showcase-tag bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25">Node.js</span>
          <span class="showcase-tag bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25">Express</span>
          <span class="showcase-tag bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25">PostgreSQL</span>
          <span class="showcase-tag bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25">WebSockets</span>
          <span class="showcase-tag bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25">Redis</span>
          <span class="showcase-tag bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25">Docker</span>
        </div>
      </div>

      <!-- Live status board mock -->
      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-5 transition-all duration-300 hover:shadow-lg flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monitor Overview</span>
          </div>
          <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">5/6 UP</span>
        </div>

        <div class="space-y-2 flex-1">
          <!-- UP -->
          <div class="monitor-row">
            <span class="status-dot bg-emerald-400"></span>
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-semibold text-color truncate">api.example.com</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400">https</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">142 ms</p>
              <p class="text-[10px] text-gray-400">99.98%</p>
            </div>
          </div>

          <!-- UP -->
          <div class="monitor-row">
            <span class="status-dot bg-emerald-400"></span>
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-semibold text-color truncate">dashboard.example.com</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400">https</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">87 ms</p>
              <p class="text-[10px] text-gray-400">100%</p>
            </div>
          </div>

          <!-- DOWN -->
          <div class="monitor-row ring-1 ring-red-500/20">
            <span class="status-dot bg-red-400 animate-pulse"></span>
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-semibold text-color truncate">payments.example.com</p>
              <p class="text-[10px] text-red-500 dark:text-red-400 font-semibold">DOWN · 4 min ago</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-[11px] font-semibold text-red-500 dark:text-red-400">timeout</p>
              <p class="text-[10px] text-gray-400">99.21%</p>
            </div>
          </div>

          <!-- UP -->
          <div class="monitor-row">
            <span class="status-dot bg-emerald-400"></span>
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-semibold text-color truncate">cdn.example.com</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400">https</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">23 ms</p>
              <p class="text-[10px] text-gray-400">100%</p>
            </div>
          </div>

          <!-- DEGRADED -->
          <div class="monitor-row ring-1 ring-amber-500/20">
            <span class="status-dot bg-amber-400"></span>
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-semibold text-color truncate">auth.example.com</p>
              <p class="text-[10px] text-amber-500 dark:text-amber-400 font-semibold">SLOW · 2.4 s</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-[11px] font-semibold text-amber-500 dark:text-amber-400">2410 ms</p>
              <p class="text-[10px] text-gray-400">99.65%</p>
            </div>
          </div>

          <!-- UP -->
          <div class="monitor-row">
            <span class="status-dot bg-emerald-400"></span>
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-semibold text-color truncate">docs.example.com</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400">https</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">61 ms</p>
              <p class="text-[10px] text-gray-400">99.99%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature highlight cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Instant alerts -->
      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-color mb-2">Instant Alerting</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Downtime triggers webhook + email notifications within seconds, with escalation policies and alert silencing windows.</p>
          </div>
        </div>
      </div>

      <!-- Response time analytics -->
      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-color mb-2">Performance Analytics</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Response-time history stored in PostgreSQL time-series tables and visualised as interactive sparkline charts with p95 / p99 stats.</p>
          </div>
        </div>
      </div>

      <!-- Cron scheduler -->
      <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h4 class="font-semibold text-color mb-2">Configurable Scheduler</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Per-monitor check intervals (30 s → 24 h), custom HTTP headers, expected status codes, and keyword assertions in the response body.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Architecture & technical details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Backend architecture -->
      <div class="bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl shadow-sm border-2 border-amber-500/20 p-8 transition-all duration-300 hover:shadow-xl hover:border-amber-500/40">
        <h3 class="text-xl font-bold text-color mb-6 flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
          </div>
          Backend Architecture
        </h3>
        <div class="space-y-4">
          <div class="arch-row">
            <div class="arch-icon bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-color">REST API — Express + TypeScript</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">CRUD for monitors, incidents, and notification channels. Input validated with Zod. JWT-secured routes.</p>
            </div>
          </div>
          <div class="arch-row">
            <div class="arch-icon bg-orange-500/15 text-orange-600 dark:text-orange-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-color">Cron Scheduler — node-cron</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Worker pool fans out HTTP probes concurrently. Results written to PostgreSQL; failures enqueued in Redis for alert dispatch.</p>
            </div>
          </div>
          <div class="arch-row">
            <div class="arch-icon bg-violet-500/15 text-violet-600 dark:text-violet-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-color">WebSocket Push — ws library</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Probe results streamed live per workspace. Clients subscribe to a monitor feed; no polling, minimal bandwidth.</p>
            </div>
          </div>
          <div class="arch-row">
            <div class="arch-icon bg-red-500/15 text-red-600 dark:text-red-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/><path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/><path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-color">Redis — BullMQ alert queue</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Decouples probe results from notification delivery. Retries failed webhook dispatches with exponential back-off.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Frontend highlights -->
      <div class="bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-2xl shadow-sm border-2 border-orange-500/20 p-8 transition-all duration-300 hover:shadow-xl hover:border-orange-500/40">
        <h3 class="text-xl font-bold text-color mb-6 flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd"/>
            </svg>
          </div>
          Frontend Highlights
        </h3>
        <div class="space-y-4">
          <div class="arch-row">
            <div class="arch-icon bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-color">Vue 3 Composition API + TypeScript</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Composables for WebSocket state, monitor polling, and auth — fully typed with no <code class="code-inline">any</code>.</p>
            </div>
          </div>
          <div class="arch-row">
            <div class="arch-icon bg-sky-500/15 text-sky-600 dark:text-sky-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"/></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-color">Chart.js Sparklines</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Per-monitor response-time trend charts, colour-coded by p95 threshold. Rendered in a Canvas worker to keep the UI thread free.</p>
            </div>
          </div>
          <div class="arch-row">
            <div class="arch-icon bg-pink-500/15 text-pink-600 dark:text-pink-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd"/></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-color">Tailwind CSS + CSS Variables</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Semantic colour tokens for status states (up / degraded / down) — one place to change the entire visual language.</p>
            </div>
          </div>
          <div class="arch-row">
            <div class="arch-icon bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-color">Vite + Code Splitting</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Route-level lazy loading. Charts are dynamically imported only when a monitor detail view is opened.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineEmits(['back']);
const infoBtnSeen = ref(false);
</script>

<style scoped>
.showcase-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
}

.monitor-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 7px 10px;
}

:global(.dark) .monitor-row {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.arch-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.arch-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  margin-top: 1px;
}

.code-inline {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 3px;
  padding: 0 4px;
}

:global(.dark) .code-inline {
  background: rgba(255, 255, 255, 0.08);
}

.info-btn {
  position: relative;
  overflow: hidden;
}
.info-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(115deg, transparent 30%, rgba(245,158,11,0.35) 50%, transparent 70%);
  background-size: 200% 100%;
  animation: btn-shine 2.4s ease-in-out infinite;
}
@keyframes btn-shine {
  0%   { background-position: 200% center; }
  60%  { background-position: -200% center; }
  100% { background-position: -200% center; }
}
</style>
