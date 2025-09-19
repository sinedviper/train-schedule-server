import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UsersPatchDto } from './dto/users-patch.dto';
import { UpdatePasswordDto } from '@users/dto/users-password-patch.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      const { password, ...profile } = user;
      return profile;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException('Failed to get profile');
    }
  }

  async updateProfile(userId: number, dto: UsersPatchDto) {
    try {
      return this.prisma.user.update({
        where: { id: userId },
        data: { ...dto },
        select: { id: true, name: true, login: true, role: true },
      });
    } catch (e) {
      throw new BadRequestException('Failed to update profile');
    }
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid)
      throw new BadRequestException('Old password is incorrect');

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

    return await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
      select: {
        id: true,
        name: true,
        login: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
