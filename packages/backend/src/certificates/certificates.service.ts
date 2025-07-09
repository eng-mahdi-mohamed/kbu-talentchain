import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { IpfsService } from '../ipfs/ipfs.service';
import { Certificate, CertificateType } from '@prisma/client';
import { CreateCertificateDto, UpdateCertificateDto, CertificateMetadata } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
    private ipfsService: IpfsService,
  ) {}

  async create(createCertificateDto: CreateCertificateDto): Promise<Certificate> {
    const { title, type, issuerDid, holderDid, metadata } = createCertificateDto;

    // Create certificate metadata
    const certificateMetadata: CertificateMetadata = {
      title,
      type,
      issuerDid,
      holderDid,
      issuedAt: new Date(),
      ...metadata,
    };

    // Generate certificate hash
    const hash = this.generateCertificateHash(certificateMetadata);

    // Check if certificate with this hash already exists
    const existingCertificate = await this.prisma.certificate.findUnique({
      where: { hash },
    });

    if (existingCertificate) {
      throw new BadRequestException('Certificate with this content already exists');
    }

    try {
      // Upload metadata to IPFS
      const metadataURI = await this.ipfsService.uploadJson(certificateMetadata);
      this.logger.log(`Metadata uploaded to IPFS: ${metadataURI}`);

      // Mint NFT on blockchain
      const txHash = await this.blockchainService.mintCertificate({
        to: holderDid,
        tokenURI: metadataURI,
        hash,
      });
      this.logger.log(`Certificate minted on blockchain: ${txHash}`);

      // Store certificate in database
      return await this.prisma.certificate.create({
        data: {
          title,
          type,
          issuerDid,
          holderDid,
          hash,
          metadataURI,
          txHash,
          verified: true, // Auto-verified since we just minted it
        },
      });
    } catch (error) {
      this.logger.error('Failed to create certificate', error);
      throw new BadRequestException('Failed to create certificate: ' + error.message);
    }
  }

  async findAll(): Promise<Certificate[]> {
    return this.prisma.certificate.findMany({
      include: {
        verificationLogs: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Certificate> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      include: {
        verificationLogs: true,
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  async findByHash(hash: string): Promise<Certificate | null> {
    return this.prisma.certificate.findUnique({
      where: { hash },
      include: {
        verificationLogs: true,
      },
    });
  }

  async findByHolder(holderDid: string): Promise<Certificate[]> {
    return this.prisma.certificate.findMany({
      where: { holderDid },
      include: {
        verificationLogs: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async findByIssuer(issuerDid: string): Promise<Certificate[]> {
    return this.prisma.certificate.findMany({
      where: { issuerDid },
      include: {
        verificationLogs: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async verify(hash: string, verifierDid: string): Promise<{ valid: boolean; certificate?: Certificate }> {
    const certificate = await this.findByHash(hash);
    
    if (!certificate) {
      return { valid: false };
    }

    try {
      // Verify on blockchain
      const isValidOnChain = await this.blockchainService.verifyCertificate(hash);
      
      // Log verification attempt
      await this.prisma.verificationLog.create({
        data: {
          certificateId: certificate.id,
          verifierDid,
          result: isValidOnChain ? 'valid' : 'invalid',
        },
      });

      return {
        valid: isValidOnChain,
        certificate: isValidOnChain ? certificate : undefined,
      };
    } catch (error) {
      this.logger.error('Verification failed', error);
      return { valid: false };
    }
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto): Promise<Certificate> {
    const certificate = await this.findOne(id);
    
    return this.prisma.certificate.update({
      where: { id },
      data: updateCertificateDto,
    });
  }

  async remove(id: string): Promise<Certificate> {
    const certificate = await this.findOne(id);
    
    return this.prisma.certificate.delete({
      where: { id },
    });
  }

  private generateCertificateHash(metadata: CertificateMetadata): string {
    const content = JSON.stringify({
      title: metadata.title,
      type: metadata.type,
      issuerDid: metadata.issuerDid,
      holderDid: metadata.holderDid,
      issuedAt: metadata.issuedAt.toISOString(),
      // Include any additional metadata that should affect the hash
      ...metadata,
    });
    
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  async getMetadata(metadataURI: string): Promise<CertificateMetadata> {
    try {
      return await this.ipfsService.getJson(metadataURI);
    } catch (error) {
      this.logger.error('Failed to fetch metadata from IPFS', error);
      throw new BadRequestException('Failed to fetch certificate metadata');
    }
  }
}