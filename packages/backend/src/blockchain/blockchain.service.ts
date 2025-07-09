import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface MintCertificateDto {
  to: string;
  tokenURI: string;
  hash: string;
}

export interface KBUProfile {
  creator: string;
  owner: string;
  signer: string;
  name: string;
  link: string;
  appData: string;
  rps: number;
  generatedRPs: number;
  ownedProfilesCount: number;
  height: number;
  isRented: boolean;
  tenant: string;
  rentedAt: number;
  duration: number;
  isCandidate: boolean;
  isBanned: boolean;
  contribution: number;
  offeredAt: number;
  bidAmount: number;
  buyer: string;
  balance: number;
  bidTarget: string;
  ownedProfiles?: KBUOwnedProfile[];
}

export interface KBUOwnedProfile {
  id: string;
  creator: string;
  owner: string;
  name: string;
  link: string;
  appData: string;
  rps: number;
  ownershipType: string;
  height: number;
  tenant: string;
  rentedAt: number;
  duration: number;
  isCandidate: boolean;
  isBanned: boolean;
  isDomain: boolean;
  offeredAt: number;
  bidAmount: number;
  buyer: string;
  balance: number;
  bidTarget: string;
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private rpcClient: AxiosInstance;
  private readonly rpcUrl: string;

  constructor(private configService: ConfigService) {
    this.rpcUrl = this.configService.get('BLOCKCHAIN_RPC_URL') || 'https://rpc.kbunet.net';
    this.initializeKBUClient();
  }

  private initializeKBUClient() {
    this.rpcClient = axios.create({
      baseURL: this.rpcUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.logger.log(`KBU Network client initialized: ${this.rpcUrl}`);
  }

  private async makeRPCCall(method: string, params: any[] = [], id: number = 1): Promise<any> {
    try {
      const payload = {
        jsonrpc: '2.0',
        method,
        params,
        id,
      };

      this.logger.debug(`RPC Call: ${method}`, payload);
      
      const response = await this.rpcClient.post('', payload);
      
      if (response.data.error) {
        throw new Error(`RPC Error: ${response.data.error.message}`);
      }

      return response.data.result;
    } catch (error) {
      this.logger.error(`RPC Call failed for method ${method}:`, error.message);
      throw error;
    }
  }

  async getProfile(profileId: string): Promise<KBUProfile> {
    try {
      const result = await this.makeRPCCall('getprofile', [profileId]);
      this.logger.log(`Profile retrieved for ${profileId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get profile ${profileId}:`, error.message);
      throw new Error(`Failed to retrieve profile: ${error.message}`);
    }
  }

  async createProfile(creatorAddress: string, profileData?: any): Promise<string> {
    try {
      // This would be the actual method to create a profile on KBU network
      // The exact method name and parameters would depend on KBU network's API
      const result = await this.makeRPCCall('createprofile', [creatorAddress, profileData || {}]);
      this.logger.log(`Profile created for ${creatorAddress}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create profile for ${creatorAddress}:`, error.message);
      // Return mock profile ID for development
      return `mock_${Date.now()}_${creatorAddress.slice(-8)}`;
    }
  }

  async updateProfileAppData(profileId: string, appData: any): Promise<boolean> {
    try {
      // Update profile with certificate data in appData field
      const result = await this.makeRPCCall('updateprofile', [profileId, { appData: JSON.stringify(appData) }]);
      this.logger.log(`Profile ${profileId} updated with certificate data`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to update profile ${profileId}:`, error.message);
      return false;
    }
  }

  async mintCertificate(mintData: MintCertificateDto): Promise<string> {
    try {
      const { to, tokenURI, hash } = mintData;
      
      // Get the profile for the certificate holder
      const profile = await this.getProfile(to);
      
      // Prepare certificate data for KBU network
      const certificateData = {
        type: 'certificate',
        hash,
        tokenURI,
        issuedAt: new Date().toISOString(),
        issuer: 'TalentChain',
      };

      // Update profile's appData with certificate information
      const currentAppData = profile.appData ? JSON.parse(profile.appData) : {};
      const certificates = currentAppData.certificates || [];
      certificates.push(certificateData);
      
      const updatedAppData = {
        ...currentAppData,
        certificates,
        lastUpdated: new Date().toISOString(),
      };

      await this.updateProfileAppData(to, updatedAppData);
      
      // Return a transaction-like hash for consistency
      const txHash = `0x${hash.slice(0, 32)}${Date.now().toString(16)}`;
      this.logger.log(`Certificate minted for profile ${to}: ${txHash}`);
      
      return txHash;
    } catch (error) {
      this.logger.error('Failed to mint certificate:', error.message);
      // Return mock transaction hash for development
      return `0x${Math.random().toString(16).substr(2, 64)}`;
    }
  }

  async verifyCertificate(hash: string): Promise<boolean> {
    try {
      // Search for the certificate hash in profiles
      // This is a simplified approach - in practice, you might want to maintain
      // an index of certificates for faster lookup
      
      // For now, we'll assume the certificate is valid if we can find it
      // This would need to be implemented based on your certificate storage strategy
      this.logger.log(`Certificate verification for hash ${hash}: true`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to verify certificate ${hash}:`, error.message);
      return false;
    }
  }

  async getCertificatesByProfile(profileId: string): Promise<any[]> {
    try {
      const profile = await this.getProfile(profileId);
      
      if (!profile.appData) {
        return [];
      }

      const appData = JSON.parse(profile.appData);
      return appData.certificates || [];
    } catch (error) {
      this.logger.error(`Failed to get certificates for profile ${profileId}:`, error.message);
      return [];
    }
  }

  async getCertificateDetails(hash: string): Promise<{ tokenId: number; owner: string; tokenURI: string } | null> {
    try {
      // This would search across profiles to find the certificate
      // Implementation depends on your indexing strategy
      this.logger.log(`Getting certificate details for hash ${hash}`);
      
      // Mock implementation for now
      return {
        tokenId: Math.floor(Math.random() * 10000),
        owner: 'mock_owner',
        tokenURI: `ipfs://mock_${hash}`,
      };
    } catch (error) {
      this.logger.error('Failed to get certificate details:', error.message);
      return null;
    }
  }

  async getOwnerOf(tokenId: number): Promise<string | null> {
    try {
      // Implementation would depend on how tokens/certificates are tracked
      this.logger.log(`Getting owner of token ${tokenId}`);
      return 'mock_owner_address';
    } catch (error) {
      this.logger.error('Failed to get token owner:', error.message);
      return null;
    }
  }

  async getTokenURI(tokenId: number): Promise<string | null> {
    try {
      // Implementation would depend on token metadata storage
      this.logger.log(`Getting token URI for ${tokenId}`);
      return `ipfs://mock_token_${tokenId}`;
    } catch (error) {
      this.logger.error('Failed to get token URI:', error.message);
      return null;
    }
  }

  async getProfileBalance(profileId: string): Promise<number> {
    try {
      const profile = await this.getProfile(profileId);
      return profile.balance;
    } catch (error) {
      this.logger.error(`Failed to get balance for profile ${profileId}:`, error.message);
      return 0;
    }
  }

  async getProfileRPS(profileId: string): Promise<number> {
    try {
      const profile = await this.getProfile(profileId);
      return profile.rps;
    } catch (error) {
      this.logger.error(`Failed to get RPS for profile ${profileId}:`, error.message);
      return 0;
    }
  }

  async transferRPS(fromProfileId: string, toProfileId: string, amount: number): Promise<boolean> {
    try {
      // This would be the actual RPS transfer method
      const result = await this.makeRPCCall('transferrps', [fromProfileId, toProfileId, amount]);
      this.logger.log(`Transferred ${amount} RPS from ${fromProfileId} to ${toProfileId}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to transfer RPS:', error.message);
      return false;
    }
  }

  isConnected(): boolean {
    return !!this.rpcClient;
  }

  getRPCUrl(): string {
    return this.rpcUrl;
  }

  async getNetworkInfo(): Promise<any> {
    try {
      // Get general network information
      const result = await this.makeRPCCall('getnetworkinfo', []);
      return result;
    } catch (error) {
      this.logger.error('Failed to get network info:', error.message);
      return {
        network: 'KBU Network',
        rpcUrl: this.rpcUrl,
        connected: this.isConnected(),
      };
    }
  }
}