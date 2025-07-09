import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { IpfsModule } from '../ipfs/ipfs.module';

@Module({
  imports: [BlockchainModule, IpfsModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}