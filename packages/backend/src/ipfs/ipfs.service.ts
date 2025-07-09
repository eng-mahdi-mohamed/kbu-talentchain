import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private ipfs: IPFSHTTPClient | null = null;

  constructor(private configService: ConfigService) {
    this.initializeIPFS();
  }

  private async initializeIPFS() {
    try {
      const host = this.configService.get('IPFS_HOST') || 'localhost';
      const port = parseInt(this.configService.get('IPFS_PORT')) || 5001;
      const protocol = this.configService.get('IPFS_PROTOCOL') || 'http';

      this.ipfs = create({
        host,
        port,
        protocol,
      });

      // Test connection
      const version = await this.ipfs.version();
      this.logger.log(`Connected to IPFS node version ${version.version}`);
    } catch (error) {
      this.logger.warn('IPFS not available, using mock mode', error.message);
      this.ipfs = null;
    }
  }

  async uploadJson(data: any): Promise<string> {
    if (!this.ipfs) {
      // Mock mode for development
      const mockHash = `QmMock${Math.random().toString(36).substr(2, 9)}`;
      this.logger.warn(`IPFS not available, returning mock hash: ${mockHash}`);
      return mockHash;
    }

    try {
      const jsonString = JSON.stringify(data, null, 2);
      const result = await this.ipfs.add(jsonString);
      
      this.logger.log(`JSON uploaded to IPFS: ${result.path}`);
      return result.path;
    } catch (error) {
      this.logger.error('Failed to upload JSON to IPFS', error);
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }

  async uploadFile(buffer: Buffer, filename?: string): Promise<string> {
    if (!this.ipfs) {
      const mockHash = `QmMock${Math.random().toString(36).substr(2, 9)}`;
      this.logger.warn(`IPFS not available, returning mock hash: ${mockHash}`);
      return mockHash;
    }

    try {
      const result = await this.ipfs.add({
        path: filename || 'file',
        content: buffer,
      });
      
      this.logger.log(`File uploaded to IPFS: ${result.path}`);
      return result.path;
    } catch (error) {
      this.logger.error('Failed to upload file to IPFS', error);
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }

  async getJson(hash: string): Promise<any> {
    if (!this.ipfs) {
      // Return mock data for development
      this.logger.warn(`IPFS not available, returning mock data for hash: ${hash}`);
      return {
        title: 'Mock Certificate',
        type: 'academic',
        issuerDid: 'did:example:issuer',
        holderDid: 'did:example:holder',
        issuedAt: new Date().toISOString(),
        description: 'This is mock certificate data',
      };
    }

    try {
      const chunks = [];
      for await (const chunk of this.ipfs.cat(hash)) {
        chunks.push(chunk);
      }
      
      const content = Buffer.concat(chunks).toString();
      return JSON.parse(content);
    } catch (error) {
      this.logger.error(`Failed to get JSON from IPFS hash: ${hash}`, error);
      throw new Error(`IPFS retrieval failed: ${error.message}`);
    }
  }

  async getFile(hash: string): Promise<Buffer> {
    if (!this.ipfs) {
      throw new Error('IPFS not available');
    }

    try {
      const chunks = [];
      for await (const chunk of this.ipfs.cat(hash)) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      this.logger.error(`Failed to get file from IPFS hash: ${hash}`, error);
      throw new Error(`IPFS retrieval failed: ${error.message}`);
    }
  }

  async pin(hash: string): Promise<void> {
    if (!this.ipfs) {
      this.logger.warn(`IPFS not available, cannot pin hash: ${hash}`);
      return;
    }

    try {
      await this.ipfs.pin.add(hash);
      this.logger.log(`Pinned IPFS hash: ${hash}`);
    } catch (error) {
      this.logger.error(`Failed to pin IPFS hash: ${hash}`, error);
    }
  }

  isConnected(): boolean {
    return !!this.ipfs;
  }
}