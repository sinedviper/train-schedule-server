import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersPatchDto } from './dto/users-patch.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UsersResponseDto } from './dto/users-response.dto';
import type { IRequestWithUser } from '../types/auth.types';
import { UpdatePasswordDto } from '@users/dto/users-password-patch.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UsersResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  getProfile(@Req() req: IRequestWithUser) {
    return this.usersService.getProfile(Number(req.user.userId));
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiBody({ type: UsersPatchDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UsersResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Failed to update profile' })
  updateProfile(@Req() req: IRequestWithUser, @Body() dto: UsersPatchDto) {
    return this.usersService.updateProfile(Number(req.user.userId), dto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update the current user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    type: UsersResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid old password or failed to update',
  })
  async updatePassword(
    @Req() req: IRequestWithUser,
    @Body() dto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(Number(req.user.userId), dto);
  }
}
