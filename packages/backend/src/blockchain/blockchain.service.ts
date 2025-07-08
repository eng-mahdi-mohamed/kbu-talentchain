import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

export interface MintCertificateDto {
  to: string;
  tokenURI: string;
  hash: string;
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  // Simplified contract ABI for certificate NFT
  private readonly contractABI = [
    'function mintCertificate(address to, string memory tokenURI, string memory hash) public returns (uint256)',
    'function verifyCertificate(string memory hash) public view returns (bool)',
    'function getCertificateByHash(string memory hash) public view returns (uint256, address, string memory)',
    'function ownerOf(uint256 tokenId) public view returns (address)',
    'function tokenURI(uint256 tokenId) public view returns (string memory)',
    'event CertificateMinted(uint256 indexed tokenId, address indexed holder, string hash)'
  ];

  constructor(private configService: ConfigService) {
    this.initializeBlockchain();
  }

  private async initializeBlockchain() {
    try {
      const rpcUrl = this.configService.get('BLOCKCHAIN_RPC_URL');
      const privateKey = this.configService.get('BLOCKCHAIN_PRIVATE_KEY');
      const contractAddress = this.configService.get('CERTIFICATE_CONTRACT_ADDRESS');

      if (!rpcUrl || !privateKey || !contractAddress) {
        this.logger.warn('Blockchain configuration incomplete, using mock mode');
        return;
      }

      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, this.contractABI, this.wallet);

      this.logger.log('Blockchain service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service', error);
    }
  }

  async mintCertificate(mintData: MintCertificateDto): Promise<string> {
    if (!this.contract) {
      // Mock mode for development
      this.logger.warn('Blockchain not configured, returning mock transaction hash');
      return `0x${Math.random().toString(16).substr(2, 64)}`;
    }

    try {
      const { to, tokenURI, hash } = mintData;
      
      this.logger.log(`Minting certificate for ${to} with hash ${hash}`);
      
      const tx = await this.contract.mintCertificate(to, tokenURI, hash);
      const receipt = await tx.wait();
      
      this.logger.log(`Certificate minted successfully: ${receipt.hash}`);
      return receipt.hash;
    } catch (error) {
      this.logger.error('Failed to mint certificate', error);
      throw new Error(`Blockchain minting failed: ${error.message}`);
    }
  }

  async verifyCertificate(hash: string): Promise<boolean> {
    if (!this.contract) {
      // Mock mode - always return true for development
      this.logger.warn('Blockchain not configured, returning mock verification result');
      return true;
    }

    try {
      const isValid = await this.contract.verifyCertificate(hash);
      this.logger.log(`Certificate verification for hash ${hash}: ${isValid}`);
      return isValid;
    } catch (error) {
      this.logger.error('Failed to verify certificate on blockchain', error);
      return false;
    }
  }

  async getCertificateDetails(hash: string): Promise<{ tokenId: number; owner: string; tokenURI: string } | null> {
    if (!this.contract) {
      return null;
    }

    try {
      const [tokenId, owner, tokenURI] = await this.contract.getCertificateByHash(hash);
      return {
        tokenId: Number(tokenId),
        owner,
        tokenURI,
      };
    } catch (error) {
      this.logger.error('Failed to get certificate details', error);
      return null;
    }
  }

  async getOwnerOf(tokenId: number): Promise<string | null> {
    if (!this.contract) {
      return null;
    }

    try {
      return await this.contract.ownerOf(tokenId);
    } catch (error) {
      this.logger.error('Failed to get token owner', error);
      return null;
    }
  }

  async getTokenURI(tokenId: number): Promise<string | null> {
    if (!this.contract) {
      return null;
    }

    try {
      return await this.contract.tokenURI(tokenId);
    } catch (error) {
      this.logger.error('Failed to get token URI', error);
      return null;
    }
  }

  isConnected(): boolean {
    return !!this.contract && !!this.provider;
  }
}