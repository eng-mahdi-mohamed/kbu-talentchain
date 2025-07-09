import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService, LoginDto } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with DID and wallet signature' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid signature' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('nonce')
  @ApiOperation({ summary: 'Get a nonce for wallet signature' })
  @ApiResponse({ status: 200, description: 'Nonce generated successfully' })
  getNonce() {
    const nonce = this.authService.generateNonce();
    return { nonce };
  }

  @Get('message')
  @ApiOperation({ summary: 'Get login message for wallet signature' })
  @ApiResponse({ status: 200, description: 'Login message generated' })
  getLoginMessage(@Query('walletAddress') walletAddress: string, @Query('nonce') nonce: string) {
    const message = this.authService.generateLoginMessage(walletAddress, nonce);
    return { message };
  }
}