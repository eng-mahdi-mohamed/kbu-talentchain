import { ethers } from 'ethers'
import type { WalletInfo } from '@/types'

declare global {
  interface Window {
    ethereum?: any
  }
}

class WalletService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private currentAccount: string | null = null

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
      
      // Generate DID from wallet address
      const did = this.generateDID(this.currentAccount)

      const walletInfo: WalletInfo = {
        address: this.currentAccount,
        did,
        chainId: Number(network.chainId),
        isConnected: true,
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

  private generateDID(address: string): string {
    // Simple DID generation based on wallet address
    // In production, this would integrate with a proper DID resolver
    return `did:ethr:${address}`
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

  // Certificate-specific methods
  async mintCertificate(certificateData: {
    to: string
    tokenURI: string
    hash: string
  }): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    // This would integrate with the actual certificate contract
    // For now, return a mock transaction hash
    console.log('Minting certificate:', certificateData)
    return `0x${Math.random().toString(16).substr(2, 64)}`
  }

  async verifyCertificateOnChain(hash: string): Promise<boolean> {
    if (!this.provider) {
      throw new Error('Wallet not connected')
    }

    // This would query the actual certificate contract
    // For now, return true for demonstration
    console.log('Verifying certificate on chain:', hash)
    return true
  }
}

export const walletService = new WalletService()
export default walletService