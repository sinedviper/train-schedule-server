import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import type { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token using refresh token from cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'New access token generated, refresh token updated in cookie',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR...' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh token missing or invalid' })
  async refresh(@Body() body: { refreshToken?: string }) {
    const newTokens = await this.authService.refreshToken(body.refreshToken);
    if (!newTokens) throw new UnauthorizedException();

    return newTokens;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear refresh token cookie' })
  @ApiResponse({
    status: 200,
    description: 'User logged out, refresh token cleared',
  })
  async logout(@Req() req: Request) {
    const access_token = req.header('Authorization');
    await this.authService.logout(access_token);
    return { message: 'Logged out successfully' };
  }
}
