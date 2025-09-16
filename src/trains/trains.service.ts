import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TrainsService {
  private readonly logger = new Logger(TrainsService.name);

  constructor(private prisma: PrismaService) {}

  async createTrain(dto: CreateTrainDto) {
    try {
      return this.prisma.train.create({ data: dto });
    } catch (e) {
      this.logger.error('createTrain', e);
      throw new BadRequestException('Failed to create train');
    }
  }

  async getTrains() {
    try {
      return this.prisma.train.findMany({ include: { schedules: true } });
    } catch (e) {
      this.logger.error('getTrains', e);
      throw new BadRequestException('Failed to get trains');
    }
  }

  async getTrain(id: number) {
    try {
      const train = await this.prisma.train.findUnique({ where: { id } });
      if (!train) throw new NotFoundException('Train not found');
      return train;
    } catch (e) {
      this.logger.error('getTrain', e);
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException('Failed to get train');
    }
  }

  async updateTrain(id: number, dto: UpdateTrainDto) {
    try {
      return this.prisma.train.update({ where: { id }, data: dto });
    } catch (e) {
      this.logger.error('updateTrain', e);
      throw new BadRequestException('Failed to update train');
    }
  }

  async deleteTrain(id: number) {
    try {
      return this.prisma.train.delete({ where: { id } });
    } catch (e) {
      this.logger.error('deleteTrain', e);
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Train not found');
      }
      throw new BadRequestException('Failed to delete train');
    }
  }
}
