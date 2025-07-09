import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { EmployersModule } from './employers/employers.module';
import { CertificatesModule } from './certificates/certificates.module';
import { VerificationModule } from './verification/verification.module';
import { ReputationModule } from './reputation/reputation.module';
import { AiModule } from './ai/ai.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { IpfsModule } from './ipfs/ipfs.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: parseInt(process.env.THROTTLE_TTL) || 60,
        limit: parseInt(process.env.THROTTLE_LIMIT) || 100,
      }),
    }),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    InstitutionsModule,
    EmployersModule,
    CertificatesModule,
    VerificationModule,
    ReputationModule,
    AiModule,
    BlockchainModule,
    IpfsModule,
  ],
})
export class AppModule {}