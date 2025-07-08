<template>
  <nav class="bg-white shadow-lg sticky top-0 z-40">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-800">TalentChain</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </router-link>
          <router-link to="/verify" class="text-gray-600 hover:text-blue-600 transition-colors">
            Verify
          </router-link>
          
          <!-- Authenticated Navigation -->
          <template v-if="isAuthenticated">
            <router-link 
              :to="getDashboardRoute()" 
              class="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </router-link>
            
            <!-- Admin Link -->
            <router-link 
              v-if="user?.role === 'admin'" 
              to="/admin" 
              class="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Admin
            </router-link>
          </template>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <template v-if="isAuthenticated">
            <!-- Wallet Info -->
            <div class="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">{{ formatAddress(user?.walletAddress || '') }}</span>
            </div>

            <!-- User Dropdown -->
            <div class="relative" @click="toggleUserMenu">
              <button class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-blue-600">{{ user?.name?.charAt(0) || 'U' }}</span>
                </div>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div 
                v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
              >
                <div class="px-4 py-2 border-b">
                  <p class="text-sm font-medium text-gray-800">{{ user?.name }}</p>
                  <p class="text-xs text-gray-500 capitalize">{{ user?.role }}</p>
                </div>
                <router-link 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Profile
                </router-link>
                <router-link 
                  to="/settings" 
                  class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Settings
                </router-link>
                <button 
                  @click="handleLogout" 
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </template>

          <!-- Login Button -->
          <template v-else>
            <router-link 
              to="/auth" 
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </router-link>
          </template>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden border-t bg-white py-4">
        <div class="flex flex-col space-y-2">
          <router-link 
            to="/" 
            class="text-gray-600 hover:text-blue-600 transition-colors px-4 py-2"
            @click="showMobileMenu = false"
          >
            Home
          </router-link>
          <router-link 
            to="/verify" 
            class="text-gray-600 hover:text-blue-600 transition-colors px-4 py-2"
            @click="showMobileMenu = false"
          >
            Verify
          </router-link>
          
          <template v-if="isAuthenticated">
            <router-link 
              :to="getDashboardRoute()" 
              class="text-gray-600 hover:text-blue-600 transition-colors px-4 py-2"
              @click="showMobileMenu = false"
            >
              Dashboard
            </router-link>
            
            <router-link 
              v-if="user?.role === 'admin'" 
              to="/admin" 
              class="text-gray-600 hover:text-blue-600 transition-colors px-4 py-2"
              @click="showMobileMenu = false"
            >
              Admin
            </router-link>
            
            <div class="border-t pt-2 mt-2">
              <button 
                @click="handleLogout" 
                class="text-red-600 hover:text-red-700 transition-colors px-4 py-2 w-full text-left"
              >
                Logout
              </button>
            </div>
          </template>
          
          <template v-else>
            <router-link 
              to="/auth" 
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-4"
              @click="showMobileMenu = false"
            >
              Connect Wallet
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showMobileMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showUserMenu.value = false
}

const handleLogout = async () => {
  authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
  await router.push('/')
}

const getDashboardRoute = () => {
  const role = user.value?.role
  switch (role) {
    case 'institution':
      return '/institution'
    case 'employer':
      return '/employer'
    case 'admin':
      return '/admin'
    default:
      return '/dashboard'
  }
}

const formatAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Close menus when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>