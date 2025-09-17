import { Injectable } from '@nestjs/common';
import { WsGateway } from '@ws/ws.gateway';
import { ESchedulesEvents } from './events/schedules.events';

@Injectable()
export class SchedulesWsService {
  constructor(private wsGateway: WsGateway) {}

  notifyScheduleCreated(schedule: any) {
    this.wsGateway.emitToAll(ESchedulesEvents.SCHEDULE_CREATED, schedule);
  }

  notifyScheduleUpdated(schedule: any) {
    this.wsGateway.emitToAll(ESchedulesEvents.SCHEDULE_UPDATED, schedule);
  }

  notifyScheduleDeleted(scheduleId: number) {
    this.wsGateway.emitToAll(ESchedulesEvents.SCHEDULE_DELETED, {
      id: scheduleId,
    });
  }
}
