import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(dto: CreateScheduleDto) {
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
  }

  async getSchedules(filter?: {
    trainId?: bigint;
    type?: string;
    date?: string;
  }) {
    return this.prisma.schedule.findMany({
      where: {
        ...(filter?.trainId && { trainId: filter.trainId }),
      },
      include: {
        train: true,
        points: { include: { place: true } },
      },
    });
  }

  async getSchedule(id: bigint) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { train: true, points: { include: { place: true } } },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async deleteSchedule(id: bigint) {
    return this.prisma.schedule.delete({ where: { id } });
  }
}
