<template>
  <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color transition-all duration-300 hover:shadow-lg group">
    <div class="p-6 border-b border-color">
      <h3 class="text-lg font-semibold text-color transition-all duration-200">Running Containers</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-transparent">
          <tr class="border-b border-color">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-400 uppercase tracking-wider">Container</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-400 uppercase tracking-wider">Image</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-400 uppercase tracking-wider">Memory</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-color">
          <tr v-for="user in users" :key="user.id" class="transition-all duration-200 hover:translate-x-1">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold transition-transform duration-200 hover:scale-110">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-color transition-all duration-200">{{ user.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-400 dark:text-gray-400 transition-all duration-200">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(user.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-200">
                {{ user.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 dark:text-gray-400 transition-all duration-200">
              {{ user.role }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const users = ref([
  { id: 1, name: 'ad-player', email: 'ad-display:v2.1', status: 'Running', role: '245 MB' },
  { id: 2, name: 'content-sync', email: 'sync-service:latest', status: 'Running', role: '128 MB' },
  { id: 3, name: 'analytics', email: 'analytics:v1.5', status: 'Running', role: '89 MB' },
  { id: 4, name: 'redis-cache', email: 'redis:alpine', status: 'Running', role: '32 MB' },
  { id: 5, name: 'nginx-proxy', email: 'nginx:alpine', status: 'Running', role: '18 MB' },
]);

const getStatusClass = (status) => {
  return status === 'Running'
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
};
</script>
