import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreatePlacesDto } from './dto/create-places.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(private prisma: PrismaService) {}

  async createPlace(dto: CreatePlacesDto) {
    return this.prisma.place.create({ data: dto });
  }

  async getPlaces() {
    try {
      return this.prisma.place.findMany();
    } catch (e) {
      this.logger.error('getPlaces', e);
      throw new NotFoundException('Failed to get places');
    }
  }

  async getPlace(id: number) {
    try {
      const place = await this.prisma.place.findUnique({ where: { id } });
      if (!place) throw new NotFoundException('Place not found');
      return place;
    } catch (e) {
      this.logger.error('getPlace', e);
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new NotFoundException('Failed to get place');
    }
  }

  async updatePlace(id: number, dto: CreatePlacesDto) {
    try {
      return this.prisma.place.update({ where: { id }, data: dto });
    } catch (e) {
      this.logger.error('updatePlace', e);
      throw new NotFoundException('Failed to update place');
    }
  }

  async deletePlace(id: number) {
    try {
      return this.prisma.place.delete({ where: { id } });
    } catch (e) {
      this.logger.error('updatePlace', e);
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Place schedule not found');
      }
      throw new NotFoundException('Failed to delete place');
    }
  }
}
