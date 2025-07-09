import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'Decentralized Identifier' })
  @IsString()
  did: string;

  @ApiProperty({ description: 'Wallet address' })
  @IsString()
  walletAddress: string;

  @ApiProperty({ description: 'User name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'User role', enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}