import { ethers } from 'ethers'
import axios from 'axios'
import type { WalletInfo } from '@/types'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface KBUProfile {
  creator: string
  owner: string
  signer: string
  name: string
  link: string
  appData: string
  rps: number
  generatedRPs: number
  ownedProfilesCount: number
  height: number
  isRented: boolean
  tenant: string
  rentedAt: number
  duration: number
  isCandidate: boolean
  isBanned: boolean
  contribution: number
  offeredAt: number
  bidAmount: number
  buyer: string
  balance: number
  bidTarget: string
  ownedProfiles?: any[]
}

class WalletService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private currentAccount: string | null = null
  private kbuRpcUrl: string = 'https://rpc.kbunet.net'

  async connect(): Promise<WalletInfo> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      this.currentAccount = accounts[0]

      const network = await this.provider.getNetwork()
      
      // Generate KBU profile ID from wallet address
      const profileId = this.generateKBUProfileId(this.currentAccount!)
      const did = this.generateDID(profileId)

      // Try to get existing KBU profile
      let kbuProfile: KBUProfile | null = null
      try {
        kbuProfile = await this.getKBUProfile(profileId)
      } catch (error) {
        console.log('Profile not found on KBU network, will need to create one')
      }

      const walletInfo: WalletInfo = {
        address: this.currentAccount,
        did,
        chainId: Number(network.chainId),
        isConnected: true,
        kbuProfileId: profileId,
        kbuProfile,
      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this))
      window.ethereum.on('chainChanged', this.handleChainChanged.bind(this))

      return walletInfo
    } catch (error: any) {
      console.error('Wallet connection failed:', error)
      throw new Error(`Failed to connect wallet: ${error.message}`)
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    try {
      const signature = await this.signer.signMessage(message)
      return signature
    } catch (error: any) {
      console.error('Message signing failed:', error)
      throw new Error(`Failed to sign message: ${error.message}`)
    }
  }

  async getBalance(): Promise<string> {
    if (!this.provider || !this.currentAccount) {
      throw new Error('Wallet not connected')
    }

    try {
      const balance = await this.provider.getBalance(this.currentAccount)
      return ethers.formatEther(balance)
    } catch (error: any) {
      console.error('Failed to get balance:', error)
      throw new Error(`Failed to get balance: ${error.message}`)
    }
  }

  async getKBUProfile(profileId: string): Promise<KBUProfile> {
    try {
      const response = await axios.post(this.kbuRpcUrl, {
        jsonrpc: '2.0',
        method: 'getprofile',
        params: [profileId],
        id: 1,
      })

      if (response.data.error) {
        throw new Error(`KBU RPC Error: ${response.data.error.message}`)
      }

      return response.data.result
    } catch (error: any) {
      console.error('Failed to get KBU profile:', error)
      throw new Error(`Failed to get KBU profile: ${error.message}`)
    }
  }

  async createKBUProfile(profileData?: any): Promise<string> {
    if (!this.currentAccount) {
      throw new Error('Wallet not connected')
    }

    try {
      const profileId = this.generateKBUProfileId(this.currentAccount)
      
      const response = await axios.post(this.kbuRpcUrl, {
        jsonrpc: '2.0',
        method: 'createprofile',
        params: [profileId, profileData || {}],
        id: 1,
      })

      if (response.data.error) {
        throw new Error(`KBU RPC Error: ${response.data.error.message}`)
      }

      return response.data.result
    } catch (error: any) {
      console.error('Failed to create KBU profile:', error)
      throw new Error(`Failed to create KBU profile: ${error.message}`)
    }
  }

  async updateKBUProfileAppData(profileId: string, appData: any): Promise<boolean> {
    try {
      const response = await axios.post(this.kbuRpcUrl, {
        jsonrpc: '2.0',
        method: 'updateprofile',
        params: [profileId, { appData: JSON.stringify(appData) }],
        id: 1,
      })

      if (response.data.error) {
        throw new Error(`KBU RPC Error: ${response.data.error.message}`)
      }

      return true
    } catch (error: any) {
      console.error('Failed to update KBU profile:', error)
      return false
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      console.error('Failed to switch network:', error)
      throw new Error(`Failed to switch network: ${error.message}`)
    }
  }

  disconnect(): void {
    this.provider = null
    this.signer = null
    this.currentAccount = null

    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged')
      window.ethereum.removeAllListeners('chainChanged')
    }
  }

  isConnected(): boolean {
    return !!this.provider && !!this.signer && !!this.currentAccount
  }

  getCurrentAccount(): string | null {
    return this.currentAccount
  }

  getCurrentKBUProfileId(): string | null {
    if (!this.currentAccount) return null
    return this.generateKBUProfileId(this.currentAccount)
  }

  private generateKBUProfileId(address: string): string {
    // Remove 0x prefix and convert to lowercase
    const cleanAddress = address.replace('0x', '').toLowerCase()
    
    // KBU profile IDs appear to be 40-character hex strings
    // We can use the Ethereum address directly since it's already 40 chars
    return cleanAddress
  }

  private generateDID(profileId: string): string {
    // Generate DID using KBU network format
    return `did:kbu:${profileId}`
  }

  private async handleAccountsChanged(accounts: string[]): Promise<void> {
    if (accounts.length === 0) {
      this.disconnect()
      window.location.reload()
    } else if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0]
      window.location.reload()
    }
  }

  private handleChainChanged(chainId: string): void {
    // Reload the page when chain changes
    window.location.reload()
  }

  // Utility methods
  async verifySignature(message: string, signature: string, expectedAddress: string): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature)
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()
    } catch (error) {
      console.error('Signature verification failed:', error)
      return false
    }
  }

  formatAddress(address: string): string {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  formatKBUProfileId(profileId: string): string {
    if (!profileId) return ''
    return `${profileId.slice(0, 8)}...${profileId.slice(-8)}`
  }

  // Certificate-specific methods for KBU network
  async addCertificateToProfile(certificateData: {
    hash: string
    title: string
    type: string
    issuer: string
    issuedAt: string
    metadataURI: string
  }): Promise<boolean> {
    const profileId = this.getCurrentKBUProfileId()
    if (!profileId) {
      throw new Error('No KBU profile ID available')
    }

    try {
      // Get current profile
      const profile = await this.getKBUProfile(profileId)
      
      // Parse existing appData
      const currentAppData = profile.appData ? JSON.parse(profile.appData) : {}
      const certificates = currentAppData.certificates || []
      
      // Add new certificate
      certificates.push({
        ...certificateData,
        addedAt: new Date().toISOString(),
      })
      
      // Update appData
      const updatedAppData = {
        ...currentAppData,
        certificates,
        lastUpdated: new Date().toISOString(),
        platform: 'TalentChain',
      }

      return await this.updateKBUProfileAppData(profileId, updatedAppData)
    } catch (error: any) {
      console.error('Failed to add certificate to KBU profile:', error)
      return false
    }
  }

  async getCertificatesFromProfile(): Promise<any[]> {
    const profileId = this.getCurrentKBUProfileId()
    if (!profileId) {
      return []
    }

    try {
      const profile = await this.getKBUProfile(profileId)
      
      if (!profile.appData) {
        return []
      }

      const appData = JSON.parse(profile.appData)
      return appData.certificates || []
    } catch (error: any) {
      console.error('Failed to get certificates from KBU profile:', error)
      return []
    }
  }

  async getKBUBalance(): Promise<number> {
    const profileId = this.getCurrentKBUProfileId()
    if (!profileId) {
      return 0
    }

    try {
      const profile = await this.getKBUProfile(profileId)
      return profile.balance
    } catch (error: any) {
      console.error('Failed to get KBU balance:', error)
      return 0
    }
  }

  async getKBURPS(): Promise<number> {
    const profileId = this.getCurrentKBUProfileId()
    if (!profileId) {
      return 0
    }

    try {
      const profile = await this.getKBUProfile(profileId)
      return profile.rps
    } catch (error: any) {
      console.error('Failed to get KBU RPS:', error)
      return 0
    }
  }

  // Legacy methods for compatibility
  async mintCertificate(certificateData: {
    to: string
    tokenURI: string
    hash: string
  }): Promise<string> {
    // This now adds the certificate to the KBU profile
    const success = await this.addCertificateToProfile({
      hash: certificateData.hash,
      title: 'Certificate',
      type: 'unknown',
      issuer: 'TalentChain',
      issuedAt: new Date().toISOString(),
      metadataURI: certificateData.tokenURI,
    })

    if (success) {
      // Return a mock transaction hash
      return `0x${certificateData.hash.slice(0, 32)}${Date.now().toString(16)}`
    } else {
      throw new Error('Failed to add certificate to KBU profile')
    }
  }

  async verifyCertificateOnChain(hash: string): Promise<boolean> {
    // This would search for the certificate in KBU profiles
    try {
      const certificates = await this.getCertificatesFromProfile()
      return certificates.some(cert => cert.hash === hash)
    } catch (error) {
      console.error('Certificate verification failed:', error)
      return false
    }
  }
}

export const walletService = new WalletService()
export default walletService