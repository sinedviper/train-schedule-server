import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PlacesPostDto } from './dto/places-post.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PlacesResponseDto } from '@places/dto/places-response.dto';

@ApiTags('Places')
@ApiBearerAuth()
@Controller('places')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlacesController {
  constructor(private placeService: PlacesService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new place' })
  @ApiBody({ type: PlacesPostDto })
  @ApiResponse({
    status: 201,
    description: 'Place created successfully',
    type: PlacesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Failed to create place' })
  createPlace(@Body() dto: PlacesPostDto) {
    return this.placeService.createPlace(dto);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get list of places with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'List of places with pagination info',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PlaceResponseDto' },
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
  @ApiResponse({ status: 404, description: 'No places found' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by place name',
  })
  getPlaces(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.placeService.getPlaces({ page, limit, search });
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a place by ID' })
  @ApiParam({ name: 'id', description: 'Place ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Place details',
    type: PlacesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Place not found' })
  getPlace(@Param('id') id: string) {
    return this.placeService.getPlace(Number(id));
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a place by ID' })
  @ApiParam({ name: 'id', description: 'Place ID', type: Number })
  @ApiBody({ type: PlacesPostDto })
  @ApiResponse({
    status: 200,
    description: 'Place updated successfully',
    type: PlacesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Failed to update place' })
  updatePlace(@Param('id') id: string, @Body() dto: PlacesPostDto) {
    return this.placeService.updatePlace(Number(id), dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a place by ID' })
  @ApiParam({ name: 'id', description: 'Place ID', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Place deleted successfully',
    example: { id: 1 },
  })
  @ApiResponse({
    status: 404,
    description: 'Place not found or already deleted',
  })
  deletePlace(@Param('id') id: string) {
    return this.placeService.deletePlace(Number(id));
  }
}
