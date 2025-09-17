import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { WsJwtGuard } from './ws.guard';
import { SchedulesWsService } from '@ws/schedules.ws.service';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WsGateway, WsJwtGuard, SchedulesWsService],
  exports: [WsGateway, SchedulesWsService],
})
export class WsModule {}
