import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { did: createUserDto.did },
    });

    if (existingUser) {
      throw new ConflictException('User with this DID already exists');
    }

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        ownedInstitutions: true,
        ownedEmployers: true,
      },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        ownedInstitutions: true,
        ownedEmployers: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByDid(did: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { did },
      include: {
        ownedInstitutions: true,
        ownedEmployers: true,
      },
    });
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { walletAddress },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updateRole(id: string, role: Role): Promise<User> {
    const user = await this.findOne(id);
    
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}