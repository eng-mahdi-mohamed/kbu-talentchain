import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { CertificatesModule } from '../certificates/certificates.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [CertificatesModule, BlockchainModule],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}