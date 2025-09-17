import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './ws.guard';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsJwtGuard)
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WsGateway.name);

  afterInit(server: Server) {
    this.logger.debug('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    this.logger.debug(
      `Client connected: ${client.id}, userId: ${client.data.userId}, socket size: ${this.server.sockets.sockets.size}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(
      `Client disconnected: ${client.id}, userId: ${client.data.userId}, socket size: ${this.server.sockets.sockets.size}`,
    );
  }

  emitToUser(userId: number, event: string, payload: any) {
    for (const [, socket] of this.server.sockets.sockets) {
      if (socket.data.userId === userId) socket.emit(event, payload);
    }
  }

  emitToAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
