import { Role } from '@prisma/client';

export type TAuth = {
  userId: number;
  role: Role;
  login: string;
};

export type TJwtPayload = {
  sub: number;
  role: Role;
  login: string;
};
