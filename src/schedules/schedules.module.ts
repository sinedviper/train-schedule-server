import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { PrismaService } from '@prisma/prisma.service';
import { WsModule } from '@ws/ws.module';

@Module({
  imports: [WsModule],
  providers: [SchedulesService, PrismaService],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
