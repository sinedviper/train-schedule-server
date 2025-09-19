import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { TAuth, TJwtPayload } from '../types/auth.types';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token as string | undefined;
    console.log('token', token);
    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = this.jwtService.verify<TJwtPayload>(token);

      console.log('payload', payload);

      const data = client.data as TAuth;

      data.userId = payload.sub;
      data.role = payload.role;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
