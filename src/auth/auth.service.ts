import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

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
      this.logger.error('register', e);
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

      throw new UnauthorizedException('Invalid credentials');
    } catch (e) {
      this.logger.error('validateUser', e);
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new BadRequestException('Invalid validation data.');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.validateUser(dto.login, dto.password);

      const payload = { login: user.login, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
        refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      };
    } catch (e) {
      this.logger.error('login', e);
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new BadRequestException('Invalid login or password.');
    }
  }
}
