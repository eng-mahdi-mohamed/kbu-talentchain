export interface User {
  id: string
  did: string
  walletAddress: string
  name: string
  email?: string
  role: 'user' | 'institution' | 'employer' | 'admin'
  createdAt: string
}

export interface Certificate {
  id: string
  type: 'academic' | 'experience'
  title: string
  issuerDid: string
  holderDid: string
  hash: string
  metadataURI: string
  txHash: string
  issuedAt: string
  verified: boolean
  verificationLogs?: VerificationLog[]
}

export interface VerificationLog {
  id: string
  certificateId: string
  verifierDid: string
  result: 'valid' | 'invalid'
  timestamp: string
}

export interface Institution {
  id: string
  name: string
  did: string
  publicKeys: string[]
  approved: boolean
  ownerId: string
  createdAt: string
}

export interface Employer {
  id: string
  companyName: string
  did: string
  publicKeys: string[]
  approved: boolean
  ownerId: string
  createdAt: string
}

export interface Reputation {
  id: string
  targetDid: string
  sourceDid: string
  score: number
  message: string
  createdAt: string
}

export interface CertificateMetadata {
  title: string
  type: 'academic' | 'experience'
  issuerDid: string
  holderDid: string
  issuedAt: string
  description?: string
  grade?: string
  institution?: string
  skills?: string[]
  duration?: string
  [key: string]: any
}

export interface KBUProfile {
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

export interface WalletInfo {
  address: string
  did: string
  chainId: number
  isConnected: boolean
  kbuProfileId?: string
  kbuProfile?: KBUProfile | null
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface LoginResponse {
  access_token: string
  user: User
}