import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(private prisma: PrismaService) {}

  async createPlace(dto: CreatePlaceDto) {
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

  async updatePlace(id: number, dto: UpdatePlaceDto) {
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
      throw new NotFoundException('Failed to delete place');
    }
  }
}
