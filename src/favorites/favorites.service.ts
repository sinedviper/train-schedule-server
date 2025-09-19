import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { FavoritesPostDto } from './dto/favorites-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: number, dto: FavoritesPostDto) {
    try {
      const schedule = await this.prisma.schedule.findUnique({
        where: { id: dto.scheduleId },
      });

      if (!schedule) throw new NotFoundException('Schedule not found');

      return await this.prisma.favoriteSchedule.create({
        data: {
          userId,
          scheduleId: dto.scheduleId,
        },
      });
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new ConflictException('This schedule is already in favorites');
    }
  }
  async getFavorites(userId: number, page = 1, limit = 20) {
    try {
      const [favorites, total] = await this.prisma.$transaction([
        this.prisma.favoriteSchedule.findMany({
          where: { userId },
          include: {
            schedule: {
              include: {
                points: { include: { place: true } },
              },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.favoriteSchedule.count({
          where: { userId },
        }),
      ]);

      return {
        data: favorites,
        meta: {
          page,
          limit,
          total: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      throw new BadRequestException('Failed to get favorites');
    }
  }

  async removeFavorite(userId: number, scheduleId: number) {
    try {
      return this.prisma.favoriteSchedule.delete({
        where: {
          userId_scheduleId: {
            userId,
            scheduleId,
          },
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Favorite schedule not found');
      }
      throw new BadRequestException('Failed to delete favorites');
    }
  }
}
