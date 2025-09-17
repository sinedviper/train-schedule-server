import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import type { CookieOptions, Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private cookieOption: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

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
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(dto);

    res.cookie('refresh_token', tokens.refresh_token, this.cookieOption);

    return { access_token: tokens.access_token };
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
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);

    res.cookie('refresh_token', tokens.refresh_token, this.cookieOption);

    return { access_token: tokens.access_token };
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
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = req.cookies as Record<string, string>;
    const refreshToken = cookies['refresh_token'];

    if (!refreshToken) throw new UnauthorizedException();

    const newTokens = await this.authService.refreshToken(refreshToken);
    if (!newTokens) throw new UnauthorizedException();

    res.cookie('refresh_token', newTokens.refresh_token, this.cookieOption);

    return { access_token: newTokens.access_token };
  }
}
