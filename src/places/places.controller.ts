import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreatePlacesDto } from './dto/create-places.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ResponsePlacesDto } from '@places/dto/response-places.dto';

@ApiTags('Places')
@ApiBearerAuth()
@Controller('places')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlacesController {
  constructor(private placeService: PlacesService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new place' })
  @ApiBody({ type: CreatePlacesDto })
  @ApiResponse({
    status: 201,
    description: 'Place created successfully',
    type: ResponsePlacesDto,
  })
  @ApiResponse({ status: 400, description: 'Failed to create place' })
  createPlace(@Body() dto: CreatePlacesDto) {
    return this.placeService.createPlace(dto);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all places' })
  @ApiResponse({
    status: 200,
    description: 'List of places',
    type: [ResponsePlacesDto],
  })
  @ApiResponse({ status: 404, description: 'No places found' })
  getPlaces() {
    return this.placeService.getPlaces();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a place by ID' })
  @ApiParam({ name: 'id', description: 'Place ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Place details',
    type: ResponsePlacesDto,
  })
  @ApiResponse({ status: 404, description: 'Place not found' })
  getPlace(@Param('id') id: string) {
    return this.placeService.getPlace(Number(id));
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a place by ID' })
  @ApiParam({ name: 'id', description: 'Place ID', type: Number })
  @ApiBody({ type: CreatePlacesDto })
  @ApiResponse({
    status: 200,
    description: 'Place updated successfully',
    type: ResponsePlacesDto,
  })
  @ApiResponse({ status: 404, description: 'Failed to update place' })
  updatePlace(@Param('id') id: string, @Body() dto: CreatePlacesDto) {
    return this.placeService.updatePlace(Number(id), dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a place by ID' })
  @ApiParam({ name: 'id', description: 'Place ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Place deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Place not found or already deleted',
  })
  deletePlace(@Param('id') id: string) {
    return this.placeService.deletePlace(Number(id));
  }
}
