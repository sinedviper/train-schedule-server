import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AddFavoritesDto } from './dto/add-favorites.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ResponseFavoritesDto } from './dto/response-favorites.dto';

@ApiTags('Favorites')
@ApiBearerAuth() // JWT required
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a schedule to user favorites' })
  @ApiBody({ type: AddFavoritesDto })
  @ApiResponse({
    status: 201,
    description: 'Schedule added to favorites',
    type: ResponseFavoritesDto,
  })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @ApiResponse({ status: 409, description: 'Schedule already in favorites' })
  async addFavorite(@Req() req, @Body() dto: AddFavoritesDto) {
    return await this.favoritesService.addFavorite(
      Number(req.user.userId),
      dto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all favorite schedules of the user' })
  @ApiResponse({
    status: 200,
    description: 'List of favorite schedules',
    type: [ResponseFavoritesDto],
  })
  async getFavorites(@Req() req) {
    return this.favoritesService.getFavorites(Number(req.user.userId));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a schedule from user favorites' })
  @ApiParam({ name: 'id', description: 'Schedule ID to remove', type: Number })
  @ApiResponse({ status: 200, description: 'Schedule removed from favorites' })
  @ApiResponse({ status: 404, description: 'Favorite schedule not found' })
  async removeFavorite(@Req() req, @Param('id') scheduleId: string) {
    return this.favoritesService.removeFavorite(
      Number(req.user.userId),
      Number(scheduleId),
    );
  }
}
