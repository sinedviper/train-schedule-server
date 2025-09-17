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

    if (places.length !== dto.points.length) {
      throw new NotFoundException('One or more places not found');
    }
  }

  async createSchedule(dto: SchedulesPostDto) {
    try {
      await this.checkScheduleDto(dto);

      const schedule = await this.prisma.schedule.create({
        data: {
          type: dto.type,
          points: {
            create: dto.points.map((p) => ({
              placeId: p.placeId,
              timeToArrive: p.timeToArrive,
            })),
          },
        },
        include: { points: true },
      });

      this.gateway.notifyScheduleCreated(schedule);

      return schedule;
    } catch (e) {
      throw new BadRequestException('Failed to create schedule');
    }
  }

  async getSchedules(filter?: {
    trainType?: TrainType;
    start?: { date: string; placeId: number };
    end?: { date: string; placeId: number };
  }) {
    try {
      return this.prisma.schedule.findMany({
        where: {
          ...(filter?.trainType && { train: { type: filter.trainType } }),
          ...(filter?.start &&
            filter?.end && {
              points: {
                some: {
                  AND: [
                    {
                      placeId: filter.start.placeId,
                      timeToArrive: { gte: new Date(filter.start.date) },
                    },
                    {
                      placeId: filter.end.placeId,
                      timeToArrive: { lte: new Date(filter.end.date) },
                    },
                  ],
                },
              },
            }),
        },
        include: {
          points: { include: { place: true } },
        },
      });
    } catch (e) {
      throw new BadRequestException('Failed to get schedules');
    }
  }

  async getSchedule(id: number) {
    try {
      const schedule = await this.prisma.schedule.findUnique({
        where: { id },
        include: { points: { include: { place: true } } },
      });

      if (!schedule) {
        throw new NotFoundException('Schedule not found');
      }

      return schedule;
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

      const updated = this.prisma.$transaction(async (tx) => {
        await tx.schedulePoint.deleteMany({
          where: { scheduleId: id },
        });

        return tx.schedule.update({
          where: { id },
          data: {
            type: dto.type,
            points: {
              create: dto.points.map((p) => ({
                placeId: p.placeId,
                timeToArrive: p.timeToArrive,
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
      const deleted = await this.prisma.schedule.delete({ where: { id } });

      this.gateway.notifyScheduleDeleted(id);

      return deleted;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Schedule not found');
      }
      throw new BadRequestException('Failed to update schedule');
    }
  }
}
