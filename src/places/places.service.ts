import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { PlacesPostDto } from './dto/places-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  async createPlace(dto: PlacesPostDto) {
    return this.prisma.place.create({ data: dto });
  }

  async getPlaces(params?: { page?: number; limit?: number; search?: string }) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const search = params?.search ?? '';

    try {
      const [places, total] = await this.prisma.$transaction([
        this.prisma.place.findMany({
          where: search
            ? {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              }
            : {},
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { name: 'asc' },
        }),
        this.prisma.place.count({
          where: search
            ? {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              }
            : {},
        }),
      ]);

      return {
        data: places,
        meta: {
          page,
          limit,
          total: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      throw new NotFoundException('Failed to get places');
    }
  }

  async getPlace(id: number) {
    try {
      const place = await this.prisma.place.findUnique({ where: { id } });
      if (!place) throw new NotFoundException('Place not found');
      return place;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new NotFoundException('Failed to get place');
    }
  }

  async updatePlace(id: number, dto: PlacesPostDto) {
    try {
      return this.prisma.place.update({ where: { id }, data: dto });
    } catch (e) {
      throw new NotFoundException('Failed to update place');
    }
  }

  async deletePlace(id: number) {
    try {
      return this.prisma.place.delete({ where: { id } });
    } catch (e) {
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
