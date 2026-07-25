import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(

    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,

    private readonly config: ConfigService,

  ) {}
  private async getTokens(
  userId: number,
  email: string,
) {

  const payload = {
    sub: userId,
    email,
  };

  const accessToken =
    await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('ACCESS_TOKEN_EXPIRES'),
    });

  const refreshToken =
    await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES'),
    });

  return {
    accessToken,
    refreshToken,
  };
}
private async updateRefreshToken(
  userId: number,
  refreshToken: string,
) {

  const hash = await bcrypt.hash(refreshToken, 10);

  await this.usersService.updateRefreshToken(
    userId,
    hash,
  );
}

async register(dto: RegisterDto) {

  const existingUser =
    await this.usersService.findByEmail(dto.email);

  if (existingUser) {
    throw new ConflictException(
      'Email already exists',
    );
  }

  const password = await bcrypt.hash(
    dto.password,
    10,
  );

  const user =
    this.usersService.create({

      name: dto.name,

      email: dto.email,

      password,
    });

  const savedUser =
    await this.usersService.save(user);

  const tokens =
    await this.getTokens(
      savedUser.id,
      savedUser.email,
    );

  await this.updateRefreshToken(
    savedUser.id,
    tokens.refreshToken,
  );

  return tokens;
}

async login(dto: LoginDto) {

  const user =
    await this.usersService.findByEmailWithPassword(
      dto.email,
    );

  if (!user) {
    throw new UnauthorizedException(
      'Invalid credentials',
    );
  }

  const match =
    await bcrypt.compare(
      dto.password,
      user.password,
    );

  if (!match) {
    throw new UnauthorizedException(
      'Invalid credentials',
    );
  }

  const tokens =
    await this.getTokens(
      user.id,
      user.email,
    );

  await this.updateRefreshToken(
    user.id,
    tokens.refreshToken,
  );

  return tokens;
}
async logout(userId: number) {

  await this.usersService.updateRefreshToken(
    userId,
    null,
  );

  return {
    message: 'Logged out successfully',
  };
}
}