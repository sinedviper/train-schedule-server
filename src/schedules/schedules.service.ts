import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(private prisma: PrismaService) {}

  private async checkScheduleDto(dto: CreateScheduleDto) {
    const train = await this.prisma.train.findUnique({
      where: { id: dto.trainId },
    });

    if (!train) {
      throw new NotFoundException(`Train with id=${dto.trainId} not found`);
    }

    const places = await this.prisma.place.findMany({
      where: { id: { in: dto.points.map((p) => p.placeId) } },
    });

    if (places.length !== dto.points.length) {
      throw new NotFoundException('One or more places not found');
    }
  }

  async createSchedule(dto: CreateScheduleDto) {
    try {
      await this.checkScheduleDto(dto);

      const schedule = await this.prisma.schedule.create({
        data: {
          trainId: dto.trainId,
          points: {
            create: dto.points.map((p) => ({
              placeId: p.placeId,
              timeToArrive: p.timeToArrive,
            })),
          },
        },
        include: { points: true },
      });

      return schedule;
    } catch (e) {
      this.logger.error('createSchedule', e);
      throw new BadRequestException('Failed to create schedule');
    }
  }

  async getSchedules(filter?: {
    trainId?: number;
    type?: string;
    date?: string;
  }) {
    try {
      return this.prisma.schedule.findMany({
        where: {
          ...(filter?.trainId && { trainId: filter.trainId }),
        },
        include: {
          train: true,
          points: { include: { place: true } },
        },
      });
    } catch (e) {
      this.logger.error('getSchedules', e);
      throw new BadRequestException('Failed to get schedules');
    }
  }

  async getSchedule(id: number) {
    try {
      const schedule = await this.prisma.schedule.findUnique({
        where: { id },
        include: { train: true, points: { include: { place: true } } },
      });

      if (!schedule) {
        throw new NotFoundException('Schedule not found');
      }

      return schedule;
    } catch (e) {
      this.logger.error('getSchedule', e);
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException('Failed to get schedule');
    }
  }

  async updateSchedule(id: number, dto: CreateScheduleDto) {
    try {
      const schedule = await this.prisma.schedule.findUnique({
        where: { id },
      });

      if (!schedule) {
        throw new NotFoundException('Schedule not found');
      }

      await this.checkScheduleDto(dto);

      return this.prisma.$transaction(async (tx) => {
        await tx.schedulePoint.deleteMany({
          where: { scheduleId: id },
        });

        return tx.schedule.update({
          where: { id },
          data: {
            trainId: dto.trainId,
            points: {
              create: dto.points.map((p) => ({
                placeId: p.placeId,
                timeToArrive: p.timeToArrive,
              })),
            },
          },
          include: { train: true, points: { include: { place: true } } },
        });
      });
    } catch (e) {
      this.logger.error('updateSchedule', e);
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException('Failed to update schedule');
    }
  }

  async deleteSchedule(id: number) {
    try {
      return this.prisma.schedule.delete({ where: { id } });
    } catch (e) {
      this.logger.error('deleteSchedule', e);
      throw new BadRequestException('Failed to update schedule');
    }
  }
}
