import { Module } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';
import { PrismaService } from '@prisma/prisma.service';

@Module({
  providers: [TrainsService, PrismaService],
  controllers: [TrainsController],
})
export class TrainsModule {}
