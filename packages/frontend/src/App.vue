<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
    
    <!-- Global Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const isLoading = computed(() => appStore.isLoading)
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>