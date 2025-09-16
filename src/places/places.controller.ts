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
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Controller('places')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlacesController {
  constructor(private placeService: PlacesService) {}

  @Roles(Role.ADMIN)
  @Post()
  createPlace(@Body() dto: CreatePlaceDto) {
    return this.placeService.createPlace(dto);
  }

  @Roles(Role.ADMIN)
  @Get()
  getPlaces() {
    return this.placeService.getPlaces();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  getPlace(@Param('id') id: string) {
    return this.placeService.getPlace(Number(id));
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  updatePlace(@Param('id') id: string, @Body() dto: UpdatePlaceDto) {
    return this.placeService.updatePlace(Number(id), dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  deletePlace(@Param('id') id: string) {
    return this.placeService.deletePlace(Number(id));
  }
}
