import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
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
  }

  async validateUser(login: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });

    if (user) {
      const isPasswordValid = await bcrypt.compare(pass, user.password);

      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.login, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { login: user.login, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
