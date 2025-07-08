import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type { 
  User, 
  Certificate, 
  Institution, 
  Employer, 
  Reputation,
  LoginResponse,
  ApiResponse 
} from '@/types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/auth'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(credentials: {
    did: string
    walletAddress: string
    signature: string
    message: string
  }): Promise<LoginResponse> {
    const response = await this.api.post('/auth/login', credentials)
    return response.data
  }

  async getNonce(): Promise<{ nonce: string }> {
    const response = await this.api.get('/auth/nonce')
    return response.data
  }

  async getLoginMessage(walletAddress: string, nonce: string): Promise<{ message: string }> {
    const response = await this.api.get('/auth/message', {
      params: { walletAddress, nonce }
    })
    return response.data
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get('/users/me')
    return response.data
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    const response = await this.api.get('/users')
    return response.data
  }

  async getUser(id: string): Promise<User> {
    const response = await this.api.get(`/users/${id}`)
    return response.data
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await this.api.patch(`/users/${id}`, data)
    return response.data
  }

  // Certificate endpoints
  async getCertificates(): Promise<Certificate[]> {
    const response = await this.api.get('/certificates')
    return response.data
  }

  async getCertificate(id: string): Promise<Certificate> {
    const response = await this.api.get(`/certificates/${id}`)
    return response.data
  }

  async getCertificatesByHolder(holderDid: string): Promise<Certificate[]> {
    const response = await this.api.get(`/certificates/holder/${holderDid}`)
    return response.data
  }

  async getCertificatesByIssuer(issuerDid: string): Promise<Certificate[]> {
    const response = await this.api.get(`/certificates/issuer/${issuerDid}`)
    return response.data
  }

  async createCertificate(data: {
    title: string
    type: 'academic' | 'experience'
    issuerDid: string
    holderDid: string
    metadata?: Record<string, any>
  }): Promise<Certificate> {
    const response = await this.api.post('/certificates', data)
    return response.data
  }

  async verifyCertificate(hash: string, verifierDid: string): Promise<{
    valid: boolean
    certificate?: Certificate
  }> {
    const response = await this.api.post('/verification/verify', { hash, verifierDid })
    return response.data
  }

  // Institution endpoints
  async getInstitutions(): Promise<Institution[]> {
    const response = await this.api.get('/institutions')
    return response.data
  }

  async createInstitution(data: {
    name: string
    did: string
    publicKeys: string[]
  }): Promise<Institution> {
    const response = await this.api.post('/institutions', data)
    return response.data
  }

  async approveInstitution(id: string): Promise<Institution> {
    const response = await this.api.patch(`/institutions/${id}/approve`)
    return response.data
  }

  // Employer endpoints
  async getEmployers(): Promise<Employer[]> {
    const response = await this.api.get('/employers')
    return response.data
  }

  async createEmployer(data: {
    companyName: string
    did: string
    publicKeys: string[]
  }): Promise<Employer> {
    const response = await this.api.post('/employers', data)
    return response.data
  }

  async approveEmployer(id: string): Promise<Employer> {
    const response = await this.api.patch(`/employers/${id}/approve`)
    return response.data
  }

  // Reputation endpoints
  async getReputations(targetDid: string): Promise<Reputation[]> {
    const response = await this.api.get(`/reputation/${targetDid}`)
    return response.data
  }

  async addReputation(data: {
    targetDid: string
    sourceDid: string
    score: number
    message: string
  }): Promise<Reputation> {
    const response = await this.api.post('/reputation', data)
    return response.data
  }

  // AI endpoints
  async extractCertificateData(file: File): Promise<{
    title: string
    type: string
    metadata: Record<string, any>
  }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await this.api.post('/ai/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  async chatVerification(query: string): Promise<{
    response: string
    certificates?: Certificate[]
  }> {
    const response = await this.api.post('/ai/chat', { query })
    return response.data
  }
}

export const authApi = new ApiService()
export const api = new ApiService()
export default api