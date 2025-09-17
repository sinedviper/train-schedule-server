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
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { SchedulesPostDto } from './dto/schedules-post.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
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
    name: 'trainId',
    required: false,
    description: 'Filter by train ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Schedules retrieved successfully',
    type: [SchedulesResponseDto],
  })
  getSchedules(@Query('trainId') trainId?: string) {
    return this.schedulesService.getSchedules(
      trainId ? { trainId: Number(trainId) } : {},
    );
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
