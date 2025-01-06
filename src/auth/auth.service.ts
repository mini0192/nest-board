import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  private key: string = process.env.JWT_KEY;

  getAccessToken({ user }): string {
    const payload = {
      username: user.username,
      sub: user.id
    };
    return this.jwtService.sign(
      payload,
      {
        secret: this.key,
        expiresIn: '5m'
      }
    );
  }

  getRefreshToken({ user }): string {
    const payload = {
      username: user.username,
      sub: user.id
    };
    return this.jwtService.sign(
      payload,
      {
        secret: this.key,
        expiresIn: '5m'
      }
    );
  }
}
