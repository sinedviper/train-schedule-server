import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.model';
import { FavoritesModule } from '@favorites/favorites.module';
import { SchedulesModule } from '@schedules/schedules.module';
import { PlacesModule } from '@places/places.module';
import { WsModule } from '@ws/ws.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    FavoritesModule,
    SchedulesModule,
    PlacesModule,
    WsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
