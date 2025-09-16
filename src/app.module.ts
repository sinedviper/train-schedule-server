import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.model';
import { FavoritesModule } from './favorites/favorites.module';
import { SchedulesModule } from '@schedules/schedules.module';
import { TrainsModule } from '@trains/trains.model';
import { PlacesModule } from '@places/places.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    FavoritesModule,
    SchedulesModule,
    TrainsModule,
    PlacesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
