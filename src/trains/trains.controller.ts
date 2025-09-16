import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TrainsService } from './trains.service';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('trains')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainsController {
  constructor(private schedulesService: TrainsService) {}

  @Roles(Role.ADMIN)
  @Post()
  createTrain(@Body() dto: CreateTrainDto) {
    return this.schedulesService.createTrain(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  updateTrain(@Param('id') id: string, @Body() dto: UpdateTrainDto) {
    return this.schedulesService.updateTrain(Number(id), dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteTrain(@Param('id') id: string) {
    return this.schedulesService.deleteTrain(Number(id));
  }

  @Roles(Role.ADMIN)
  @Get()
  getTrains() {
    return this.schedulesService.getTrains();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  getTrain(@Param('id') id: string) {
    return this.schedulesService.getTrain(Number(id));
  }
}
