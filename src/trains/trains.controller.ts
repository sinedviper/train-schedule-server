import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TrainsService } from './trains.service';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { TrainResponseDto } from '@trains/dto/train-response.dto';

@ApiTags('Trains')
@ApiBearerAuth()
@Controller('trains')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainsController {
  constructor(private trainsService: TrainsService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new train' })
  @ApiBody({ type: CreateTrainDto })
  @ApiResponse({
    status: 201,
    description: 'Train created successfully',
    type: TrainResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Failed to create train' })
  createTrain(@Body() dto: CreateTrainDto) {
    return this.trainsService.createTrain(dto);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all trains' })
  @ApiResponse({
    status: 200,
    description: 'List of trains',
    type: [TrainResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Failed to get trains' })
  getTrains() {
    return this.trainsService.getTrains();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get train by ID' })
  @ApiParam({ name: 'id', description: 'Train ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Train details',
    type: TrainResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Train not found' })
  getTrain(@Param('id') id: string) {
    return this.trainsService.getTrain(Number(id));
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a train by ID' })
  @ApiParam({ name: 'id', description: 'Train ID', type: Number })
  @ApiBody({ type: UpdateTrainDto })
  @ApiResponse({
    status: 200,
    description: 'Train updated successfully',
    type: TrainResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Train not found' })
  updateTrain(@Param('id') id: string, @Body() dto: UpdateTrainDto) {
    return this.trainsService.updateTrain(Number(id), dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a train by ID' })
  @ApiParam({ name: 'id', description: 'Train ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Train deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Train not found' })
  deleteTrain(@Param('id') id: string) {
    return this.trainsService.deleteTrain(Number(id));
  }
}
