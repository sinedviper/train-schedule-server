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

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post()
  addFavorite(@Req() req, @Body() dto: AddFavoritesDto) {
    return this.favoritesService.addFavorite(Number(req.user.userId), dto);
  }

  @Get()
  getFavorites(@Req() req) {
    return this.favoritesService.getFavorites(Number(req.user.userId));
  }

  @Delete(':id')
  removeFavorite(@Req() req, @Param('id') scheduleId: string) {
    return this.favoritesService.removeFavorite(
      Number(req.user.userId),
      Number(scheduleId),
    );
  }
}
