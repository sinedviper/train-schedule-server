import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  Query,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { SchedulesPostDto } from './dto/schedules-post.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Role, TrainType } from '@prisma/client';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { SchedulesResponseDto } from '@schedules/dto/schedules-response.dto';

@ApiTags('Schedules')
@ApiBearerAuth()
@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new train schedule' })
  @ApiBody({ type: SchedulesPostDto })
  @ApiResponse({
    status: 201,
    description: 'Schedule created successfully',
    type: SchedulesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Failed to create schedule' })
  createSchedule(@Body() dto: SchedulesPostDto) {
    return this.schedulesService.createSchedule(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing train schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID', example: 1 })
  @ApiBody({ type: SchedulesPostDto })
  @ApiResponse({
    status: 200,
    description: 'Schedule updated successfully',
    type: SchedulesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  putSchedule(@Param('id') id: string, @Body() dto: SchedulesPostDto) {
    return this.schedulesService.updateSchedule(Number(id), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all train schedules' })
  @ApiQuery({
    name: 'trainType',
    required: false,
    description: 'Filter by train type',
    enum: TrainType,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO string)',
    type: String,
  })
  @ApiQuery({
    name: 'startPlaceId',
    required: false,
    description: 'Start place ID',
    type: Number,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO string)',
    type: String,
  })
  @ApiQuery({
    name: 'endPlaceId',
    required: false,
    description: 'End place ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Schedules retrieved successfully',
    type: [SchedulesResponseDto],
  })
  async getSchedules(
    @Query('trainType') trainType?: TrainType,
    @Query('startDate') startDate?: string,
    @Query('startPlaceId') startPlaceId?: string,
    @Query('endDate') endDate?: string,
    @Query('endPlaceId') endPlaceId?: string,
  ) {
    if (
      (startDate && !startPlaceId) ||
      (startPlaceId && !startDate) ||
      (endDate && !endPlaceId) ||
      (endPlaceId && !endDate)
    ) {
      throw new BadRequestException(
        'Both date and placeId must be provided for start and end filters',
      );
    }

    const filter: {
      trainType?: TrainType;
      start?: { date: string; placeId: number };
      end?: { date: string; placeId: number };
    } = {};

    if (trainType) {
      filter.trainType = trainType;
    }

    if (startDate && startPlaceId) {
      filter.start = { date: startDate, placeId: Number(startPlaceId) };
    }

    if (endDate && endPlaceId) {
      filter.end = { date: endDate, placeId: Number(endPlaceId) };
    }

    return await this.schedulesService.getSchedules(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiParam({ name: 'id', description: 'Schedule ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Schedule retrieved successfully',
    type: SchedulesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  getSchedule(@Param('id') id: string) {
    return this.schedulesService.getSchedule(Number(id));
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  deleteSchedule(@Param('id') id: string) {
    return this.schedulesService.deleteSchedule(Number(id));
  }
}
