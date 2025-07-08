import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import { walletService } from '@/services/wallet'
import type { User } from '@/types'

interface LoginCredentials {
  did: string
  walletAddress: string
  signature: string
  message: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const initialize = async () => {
    try {
      const savedToken = localStorage.getItem('auth_token')
      if (savedToken) {
        token.value = savedToken
        // Validate token by fetching user profile
        const userData = await authApi.getProfile()
        user.value = userData
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      logout()
    } finally {
      isInitialized.value = true
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials)
      token.value = response.access_token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.access_token)
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const connectWallet = async () => {
    try {
      const walletData = await walletService.connect()
      return walletData
    } catch (error) {
      console.error('Wallet connection failed:', error)
      throw error
    }
  }

  const signMessage = async (message: string): Promise<string> => {
    try {
      return await walletService.signMessage(message)
    } catch (error) {
      console.error('Message signing failed:', error)
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    walletService.disconnect()
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  return {
    user,
    token,
    isInitialized,
    isAuthenticated,
    initialize,
    login,
    connectWallet,
    signMessage,
    logout,
    updateUser
  }
})