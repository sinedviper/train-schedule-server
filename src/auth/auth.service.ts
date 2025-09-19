import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Prisma, User } from '@prisma/client';
import { TJwtPayload } from '../types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  private createJwt(user: User) {
    const payload = { login: user.login, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async register(dto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      await this.prisma.user.create({
        data: {
          name: dto.name,
          login: dto.login,
          password: hashedPassword,
          role: dto.role,
        },
      });

      return this.login({ login: dto.login, password: dto.password });
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Login already exists');
      }
      throw new BadRequestException('Failed to register');
    }
  }

  async validateUser(login: string, pass: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { login } });

      if (user) {
        const isPasswordValid = await bcrypt.compare(pass, user.password);

        if (isPasswordValid) {
          const { password, ...result } = user;
          return result;
        }
      }

      throw new UnauthorizedException('Invalid login or password.');
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new BadRequestException('Invalid validation data.');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.validateUser(dto.login, dto.password);

      const { access_token, refresh_token } = this.createJwt(user as User);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refresh_token },
      });

      return { access_token, refresh_token };
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new BadRequestException('Invalid login or password.');
    }
  }

  async refreshToken(refreshToken?: string) {
    try {
      if (!refreshToken) return null;
      const payload = this.jwtService.verify<TJwtPayload>(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || refreshToken !== user.refreshToken) return null;

      const { access_token, refresh_token } = this.createJwt(user);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refresh_token },
      });

      return { access_token, refresh_token };
    } catch (e) {
      return null;
    }
  }

  async logout(access_token?: string) {
    try {
      if (!access_token) return;

      const token = access_token.split(' ')[1];

      const payload = this.jwtService.verify<TJwtPayload>(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) return;

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
    } catch (e) {
      throw new BadRequestException('Failed to logout');
    }
  }
}
