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
  Req,
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
import type { IRequestWithUser } from '../types/auth.types';

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
  @ApiOperation({
    summary: 'Get train schedules with filters, pagination, and place info',
  })
  @ApiQuery({
    name: 'trainType',
    required: false,
    enum: TrainType,
    description: 'Filter by train type',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'startPlaceId',
    required: false,
    type: Number,
    description: 'Start place ID',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (ISO string)',
  })
  @ApiQuery({
    name: 'endPlaceId',
    required: false,
    type: Number,
    description: 'End place ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Schedules retrieved successfully with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/SchedulesResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  async getSchedules(
    @Req() req: IRequestWithUser,
    @Query('type') type?: TrainType,
    @Query('startDate') startDate?: string,
    @Query('startPlaceId') startPlaceId?: string,
    @Query('endDate') endDate?: string,
    @Query('endPlaceId') endPlaceId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filter = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      userId: req.user.userId,
      type,
      startDate,
      startPlaceId: startPlaceId ? Number(startPlaceId) : undefined,
      endDate,
      endPlaceId: endPlaceId ? Number(endPlaceId) : undefined,
    };
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
  getSchedule(@Req() req: IRequestWithUser, @Param('id') id: string) {
    return this.schedulesService.getSchedule(Number(id), req.user.userId);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Schedule deleted successfully',
    example: { id: 1 },
  })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  deleteSchedule(@Param('id') id: string) {
    return this.schedulesService.deleteSchedule(Number(id));
  }
}
