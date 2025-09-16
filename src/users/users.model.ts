import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [],
})
export class AuthModule {}
