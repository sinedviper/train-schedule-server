import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AddFavoritesDto } from './dto/add-favorites.dto';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: number, dto: AddFavoritesDto) {
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
      this.logger.error('addFavorite', e);
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new ConflictException('This schedule is already in favorites');
    }
  }

  async getFavorites(userId: number) {
    try {
      return this.prisma.favoriteSchedule.findMany({
        where: { userId },
        include: {
          schedule: {
            include: {
              train: true,
              points: { include: { place: true } },
            },
          },
        },
      });
    } catch (e) {
      this.logger.error('getFavorites', e);
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
      this.logger.error('removeFavorite', e);
      throw new BadRequestException('Failed to get favorites');
    }
  }
}
