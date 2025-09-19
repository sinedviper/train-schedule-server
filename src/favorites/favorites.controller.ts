import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { FavoritesPostDto } from './dto/favorites-post.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import type { IRequestWithUser } from '../types/auth.types';

@ApiTags('Favorites')
@ApiBearerAuth() // JWT required
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a schedule to user favorites' })
  @ApiBody({ type: FavoritesPostDto })
  @ApiResponse({
    status: 201,
    description: 'Schedule added to favorites',
    type: FavoritesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @ApiResponse({ status: 409, description: 'Schedule already in favorites' })
  async addFavorite(
    @Req() req: IRequestWithUser,
    @Body() dto: FavoritesPostDto,
  ) {
    return await this.favoritesService.addFavorite(
      Number(req.user.userId),
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all favorite schedules of the user with pagination',
  })
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
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of favorite schedules with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/FavoritesResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 50 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            totalPages: { type: 'number', example: 3 },
          },
        },
      },
    },
  })
  async getFavorites(
    @Req() req: IRequestWithUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = Number(req.user.userId);
    return this.favoritesService.getFavorites(
      userId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a schedule from user favorites' })
  @ApiParam({ name: 'id', description: 'Schedule ID to remove', type: Number })
  @ApiResponse({ status: 200, description: 'Schedule removed from favorites' })
  @ApiResponse({ status: 404, description: 'Favorite schedule not found' })
  async removeFavorite(
    @Req() req: IRequestWithUser,
    @Param('id') scheduleId: string,
  ) {
    return this.favoritesService.removeFavorite(
      Number(req.user.userId),
      Number(scheduleId),
    );
  }
}
