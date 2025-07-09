<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connect to TalentChain
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Connect your wallet to access the decentralized certificate platform
        </p>
      </div>

      <div class="mt-8 space-y-6">
        <!-- Wallet Connection -->
        <div v-if="!isConnecting && !walletConnected" class="space-y-4">
          <button
            @click="connectWallet"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Connect MetaMask Wallet
          </button>
          
          <p class="text-xs text-gray-500 text-center">
            Make sure you have MetaMask installed and unlocked
          </p>
        </div>

        <!-- Connecting State -->
        <div v-if="isConnecting" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-sm text-gray-600">{{ connectionStep }}</p>
        </div>

        <!-- Wallet Connected -->
        <div v-if="walletConnected && !isAuthenticated" class="space-y-4">
          <!-- Wallet Info -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span class="text-sm font-medium text-green-800">Wallet Connected</span>
            </div>
            <div class="mt-2 text-sm text-green-700">
              <p><strong>Address:</strong> {{ formatAddress(walletInfo?.address || '') }}</p>
              <p><strong>KBU Profile:</strong> {{ formatKBUProfileId(walletInfo?.kbuProfileId || '') }}</p>
              <p v-if="walletInfo?.kbuProfile"><strong>KBU RPS:</strong> {{ walletInfo.kbuProfile.rps.toLocaleString() }}</p>
              <p v-if="walletInfo?.kbuProfile"><strong>Balance:</strong> {{ walletInfo.kbuProfile.balance.toLocaleString() }}</p>
            </div>
          </div>

          <!-- Sign Message Button -->
          <button
            @click="signAndLogin"
            :disabled="isSigning"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
          >
            <svg v-if="!isSigning" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.982-6.982a6 6 0 010-8.486z"></path>
            </svg>
            <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            {{ isSigning ? 'Signing Message...' : 'Sign Message & Login' }}
          </button>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Success and Redirect -->
        <div v-if="isAuthenticated" class="text-center py-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Authentication Successful!</h3>
          <p class="text-sm text-gray-600 mb-4">Redirecting to your dashboard...</p>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-8 border-t border-gray-200 pt-6">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Need Help?</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p>• Make sure MetaMask is installed and unlocked</p>
          <p>• Your wallet will be used to generate a KBU network profile</p>
          <p>• No gas fees required for authentication</p>
          <p>• Your certificates will be stored on the KBU network</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import type { WalletInfo } from '@/types'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const appStore = useAppStore()

const isConnecting = ref(false)
const isSigning = ref(false)
const walletConnected = ref(false)
const walletInfo = ref<WalletInfo | null>(null)
const error = ref<string | null>(null)
const connectionStep = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated)

const connectWallet = async () => {
  error.value = null
  isConnecting.value = true
  connectionStep.value = 'Connecting to wallet...'

  try {
    connectionStep.value = 'Requesting wallet access...'
    const wallet = await authStore.connectWallet()
    
    connectionStep.value = 'Fetching KBU profile...'
    walletInfo.value = wallet
    walletConnected.value = true
    
    toast.success('Wallet connected successfully!')
  } catch (err: any) {
    error.value = err.message || 'Failed to connect wallet'
    toast.error(error.value)
  } finally {
    isConnecting.value = false
    connectionStep.value = ''
  }
}

const signAndLogin = async () => {
  if (!walletInfo.value) return

  error.value = null
  isSigning.value = true

  try {
    // Get nonce from backend
    const { nonce } = await authStore.getNonce()
    
    // Get login message
    const { message } = await authStore.getLoginMessage(walletInfo.value.address, nonce)
    
    // Sign message
    const signature = await authStore.signMessage(message)
    
    // Login with signature
    await authStore.login({
      did: walletInfo.value.did,
      walletAddress: walletInfo.value.address,
      signature,
      message,
    })

    toast.success('Login successful!')
    
    // Redirect to appropriate dashboard
    setTimeout(() => {
      const user = authStore.user
      if (user) {
        switch (user.role) {
          case 'institution':
            router.push('/institution')
            break
          case 'employer':
            router.push('/employer')
            break
          case 'admin':
            router.push('/admin')
            break
          default:
            router.push('/dashboard')
        }
      } else {
        router.push('/dashboard')
      }
    }, 1500)
  } catch (err: any) {
    error.value = err.message || 'Authentication failed'
    toast.error(error.value)
  } finally {
    isSigning.value = false
  }
}

const formatAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatKBUProfileId = (profileId: string) => {
  if (!profileId) return ''
  return `${profileId.slice(0, 8)}...${profileId.slice(-8)}`
}

// Check if already authenticated
onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  }
})
</script>