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

  /**
   * Generate access token and refresh token
   */
  private async getTokens(
    userId: string,
    email: string,
  ) {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>(
          'ACCESS_TOKEN_EXPIRES',
          '15m',
        ) as any,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      payload,
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>(
          'REFRESH_TOKEN_EXPIRES',
          '7d',
        ) as any,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Hash and store refresh token
   */
  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ) {
    const hash = await bcrypt.hash(
      refreshToken,
      10,
    );

    await this.usersService.updateRefreshToken(
      userId,
      hash,
    );
  }

  /**
   * Register user
   */
  async register(dto: RegisterDto) {
    const existingUser =
      await this.usersService.findByEmail(
        dto.email,
      );

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(dto.password, 10);

    const user = this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const savedUser =
      await this.usersService.save(user);

    const tokens = await this.getTokens(
      savedUser.id,
      savedUser.email,
    );

    await this.updateRefreshToken(
      savedUser.id,
      tokens.refreshToken,
    );

    return {
      message: 'Registration successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Login user
   */
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

    const isPasswordValid =
      await bcrypt.compare(
        dto.password,
        user.password,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const tokens = await this.getTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(
      user.id,
      tokens.refreshToken,
    );

    return {
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(
      userId,
      null,
    );

    return {
      message: 'Logged out successfully',
    };
  }


  async refreshToken(refreshToken: string) {
    try {
      const payload =
        await this.jwtService.verifyAsync<{
          sub: string;
          email: string;
        }>(refreshToken, {
          secret: this.config.get<string>(
            'JWT_REFRESH_SECRET',
          ),
        });

      const user =
        await this.usersService.findByIdWithRefreshToken(
          payload.sub,
        );

      if (
        !user ||
        !user.hashedRefreshToken
      ) {
        throw new UnauthorizedException(
          'Invalid refresh token',
        );
      }

      const refreshTokenMatches =
        await bcrypt.compare(
          refreshToken,
          user.hashedRefreshToken,
        );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException(
          'Invalid refresh token',
        );
      }

      const tokens = await this.getTokens(
        user.id,
        user.email,
      );

      await this.updateRefreshToken(
        user.id,
        tokens.refreshToken,
      );

      return tokens;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
      );
    }
  }
}