import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Injectable()
export class TrainsService {
  constructor(private prisma: PrismaService) {}

  async createTrain(dto: CreateTrainDto) {
    return this.prisma.train.create({ data: dto });
  }

  async getTrains() {
    return this.prisma.train.findMany({ include: { schedules: true } });
  }

  async getTrain(id: number) {
    const train = await this.prisma.train.findUnique({ where: { id } });
    if (!train) throw new NotFoundException('Train not found');
    return train;
  }

  async updateTrain(id: number, dto: UpdateTrainDto) {
    return this.prisma.train.update({ where: { id }, data: dto });
  }

  async deleteTrain(id: number) {
    return this.prisma.train.delete({ where: { id } });
  }
}
