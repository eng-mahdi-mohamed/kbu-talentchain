import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { ethers } from 'ethers';

export interface AuthPayload {
  sub: string;
  did: string;
  walletAddress: string;
  role: string;
}

export interface LoginDto {
  did: string;
  walletAddress: string;
  signature: string;
  message: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateDIDSignature(
    message: string,
    signature: string,
    expectedAddress: string,
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      this.logger.error('Signature validation failed', error);
      return false;
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: User }> {
    const { did, walletAddress, signature, message } = loginDto;

    // Validate signature
    const isValidSignature = await this.validateDIDSignature(
      message,
      signature,
      walletAddress,
    );

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Find or create user
    let user = await this.usersService.findByDid(did);
    
    if (!user) {
      // Auto-register user if they don't exist
      user = await this.usersService.create({
        did,
        walletAddress,
        name: `User-${did.slice(-8)}`, // Default name from DID
      });
    }

    // Update wallet address if changed
    if (user.walletAddress !== walletAddress) {
      user = await this.usersService.update(user.id, { walletAddress });
    }

    const payload: AuthPayload = {
      sub: user.id,
      did: user.did,
      walletAddress: user.walletAddress,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUser(payload: AuthPayload): Promise<User | null> {
    return this.usersService.findOne(payload.sub);
  }

  generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  generateLoginMessage(walletAddress: string, nonce: string): string {
    return `Welcome to KBU TalentChain!\n\nPlease sign this message to authenticate your identity.\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
  }
}