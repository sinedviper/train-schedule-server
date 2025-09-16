import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Roles(Role.ADMIN)
  @Post()
  createSchedule(@Body() dto: CreateScheduleDto) {
    return this.schedulesService.createSchedule(dto);
  }

  @Get()
  getSchedules(@Query('trainId') trainId?: string) {
    return this.schedulesService.getSchedules(
      trainId ? { trainId: BigInt(trainId) } : {},
    );
  }

  @Get(':id')
  getSchedule(@Param('id') id: string) {
    return this.schedulesService.getSchedule(BigInt(id));
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteSchedule(@Param('id') id: string) {
    return this.schedulesService.deleteSchedule(BigInt(id));
  }
}
