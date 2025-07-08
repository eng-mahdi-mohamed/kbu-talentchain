import { IsString, IsEnum, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CertificateType } from '@prisma/client';

export interface CertificateMetadata {
  title: string;
  type: CertificateType;
  issuerDid: string;
  holderDid: string;
  issuedAt: Date;
  description?: string;
  grade?: string;
  institution?: string;
  skills?: string[];
  duration?: string;
  [key: string]: any;
}

export class CreateCertificateDto {
  @ApiProperty({ description: 'Certificate title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Certificate type', enum: CertificateType })
  @IsEnum(CertificateType)
  type: CertificateType;

  @ApiProperty({ description: 'Issuer DID' })
  @IsString()
  issuerDid: string;

  @ApiProperty({ description: 'Certificate holder DID' })
  @IsString()
  holderDid: string;

  @ApiPropertyOptional({ description: 'Additional certificate metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}