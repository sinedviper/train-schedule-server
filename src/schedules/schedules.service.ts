import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { SchedulesPostDto } from './dto/schedules-post.dto';
import { Prisma, TrainType } from '@prisma/client';
import { SchedulesWsService } from '@ws/schedules.ws.service';

@Injectable()
export class SchedulesService {
  constructor(
    private prisma: PrismaService,
    private gateway: SchedulesWsService,
  ) {}

  private async checkScheduleDto(dto: SchedulesPostDto) {
    const places = await this.prisma.place.findMany({
      where: { id: { in: dto.points.map((p) => p.placeId) } },
    });
    const placeIds = dto.points.map((p) => p.placeId);
    const foundIds = new Set(places.map((p) => p.id));

    const notFound = placeIds.filter((id) => !foundIds.has(id));

    if (notFound.length > 0) {
      throw new NotFoundException(
        `One or more places not found: ${notFound.join(', ')}`,
      );
    }
  }

  async createSchedule(dto: SchedulesPostDto) {
    try {
      await this.checkScheduleDto(dto);

      const schedule = await this.prisma.schedule.create({
        data: {
          type: dto.type,
          points: {
            create: dto.points.map((p, k) => ({
              placeId: p.placeId,
              timeToArrive: p.timeToArrive,
              order: k,
            })),
          },
        },
        include: { points: { include: { place: true } } },
      });

      this.gateway.notifyScheduleCreated(schedule);

      return schedule;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new BadRequestException('Failed to create schedule');
    }
  }

  async getSchedules(params?: {
    type?: TrainType;
    startDate?: string;
    startPlaceId?: number;
    endDate?: string;
    endPlaceId?: number;
    page?: number;
    limit?: number;
    userId?: number;
  }) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;

    try {
      const startFilter: PointFilter = { points: { some: {} } };

      if (params?.startPlaceId) {
        startFilter.points.some.placeId = params.startPlaceId;
      }
      if (params?.startDate) {
        startFilter.points.some.timeToArrive = {
          gte: new Date(params.startDate),
        };
      }
      if (params?.startPlaceId || params?.startDate) {
        startFilter.points.some.order = 0;
      }

      const endFilter: PointFilter = { points: { some: {} } };

      if (params?.endPlaceId) {
        endFilter.points.some.placeId = params.endPlaceId;
      }
      if (params?.endDate) {
        endFilter.points.some.timeToArrive = {
          lte: new Date(params.endDate),
        };
      }
      if (params?.endPlaceId || params?.endDate) {
        endFilter.points.some.order = { not: 0 };
      }

      const [schedules, total] = await this.prisma.$transaction([
        this.prisma.schedule.findMany({
          where: {
            ...(params?.type && { type: params.type }),
            AND: [startFilter, endFilter],
          },
          include: {
            points: { include: { place: true } },
            favorites: params?.userId
              ? { where: { userId: params.userId }, select: { id: true } }
              : false,
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.schedule.count({
          where: {
            ...(params?.type && { type: params.type }),
            AND: [startFilter, endFilter],
          },
        }),
      ]);

      return {
        data: schedules.map(({ favorites, ...s }) => ({
          ...s,
          isFavorite: favorites && favorites.length > 0,
        })),
        meta: {
          page,
          limit,
          total: Math.max(1, Math.ceil(total / limit)),
        },
      };
    } catch (e) {
      throw new BadRequestException('Failed to get schedules');
    }
  }

  async getSchedule(id: number, userId?: number) {
    try {
      const schedule = await this.prisma.schedule.findUnique({
        where: { id },
        include: { points: { include: { place: true } } },
      });

      if (!schedule) {
        throw new NotFoundException('Schedule not found');
      }

      let isFavorite = false;
      if (userId) {
        const favorite = await this.prisma.favoriteSchedule.findFirst({
          where: { userId, scheduleId: id },
        });
        isFavorite = !!favorite;
      }

      return {
        ...schedule,
        isFavorite,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException('Failed to get schedule');
    }
  }

  async updateSchedule(id: number, dto: SchedulesPostDto) {
    try {
      const schedule = await this.prisma.schedule.findUnique({
        where: { id },
      });

      if (!schedule) {
        throw new NotFoundException('Schedule not found');
      }

      await this.checkScheduleDto(dto);

      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.schedulePoint.deleteMany({
          where: { scheduleId: id },
        });

        return tx.schedule.update({
          where: { id },
          data: {
            type: dto.type,
            points: {
              create: dto.points.map((p, k) => ({
                placeId: p.placeId,
                timeToArrive: p.timeToArrive,
                order: k,
              })),
            },
          },
          include: { points: { include: { place: true } } },
        });
      });

      this.gateway.notifyScheduleUpdated(updated);

      return updated;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException('Failed to update schedule');
    }
  }

  async deleteSchedule(id: number) {
    try {
      const deleted = await this.prisma.$transaction(async (tx) => {
        await tx.schedulePoint.deleteMany({
          where: { scheduleId: id },
        });

        await tx.favoriteSchedule.deleteMany({
          where: { scheduleId: id },
        });

        const schedule = await tx.schedule.delete({
          where: { id },
        });

        return schedule;
      });

      this.gateway.notifyScheduleDeleted(id);

      return deleted;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Schedule not found');
      }

      throw new BadRequestException('Failed to delete schedule');
    }
  }
}

type FilterValue = { gte: Date } | { lte: Date } | { not: number } | number;
type PointFilter = Record<
  'points',
  {
    some: Record<string, FilterValue>;
  }
>;
